"use client";

import AuthService from "@/services/AuthService";
import {
  ACTIONS,
  MODULE_ACTIONS,
  MODULE_PERMISSIONS,
  MODULES,
  ROLE_PERMISSIONS,
} from "@/utils/utils";
import axios from "axios";
import { useRouter } from "next/navigation";
import {
  useContext,
  createContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
  useMemo,
} from "react";

interface AuthContextType {
  // isAuthenticated is set to a string value so dynamic rendering can rely on more than just true/false
  isAuthenticated: UserStates | undefined;
  roles: string[];
  login: (jwtAuthResponse: JWTAuthResponse) => Promise<void>;
  logout: () => void;
  hasPermission: (
    module: keyof MODULE_PERMISSIONS,
    action: MODULE_ACTIONS,
  ) => boolean;
}

export enum UserStates {
  AUTHENTICATED,
  UNAUTHENTICATED,
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const getSessionUsername = () => {
  return localStorage.getItem("username");
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {

  const [isAuthenticated, setIsAuthenticated] = useState<UserStates>();
  const [roles, setRoles] = useState<string[]>([]);
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const roles = localStorage.getItem("roles")?.split(",") || [];
    console.log(roles, roles.includes("TRACKER"));

    setRoles(roles);
    if (!token) {
      setIsAuthenticated(UserStates.UNAUTHENTICATED);
    } else {
      setIsAuthenticated(UserStates.AUTHENTICATED);
    }
  }, []);

  const login = async (jwtAuthResponse: JWTAuthResponse) => {
    localStorage.setItem("accessToken", jwtAuthResponse.accessToken);
    localStorage.setItem("tokenType", jwtAuthResponse.tokenType);
    localStorage.setItem("refreshToken", jwtAuthResponse.refreshToken);
    localStorage.setItem("username", jwtAuthResponse.username);
    localStorage.setItem("email", jwtAuthResponse.email);
    localStorage.setItem(
      "isVerifiedEmail",
      String(jwtAuthResponse.isVerifiedEmail),
    );
    localStorage.setItem("roles", String(jwtAuthResponse.roles));
    localStorage.setItem("expiration", String(jwtAuthResponse.expiration));

    setIsAuthenticated(UserStates.AUTHENTICATED);
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("tokenType");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("username");
    localStorage.removeItem("email");
    localStorage.removeItem("isVerifiedEmail");
    localStorage.removeItem("roles");
    localStorage.removeItem("expiration");
    setIsAuthenticated(UserStates.UNAUTHENTICATED);
  };

  const hasPermission = useCallback(
    (module: keyof MODULE_PERMISSIONS, action: MODULE_ACTIONS) => {
      return roles.some((role) => {
        if (!ROLE_PERMISSIONS[role]) {
          console.error(`NOT A VALID ROLE: ${role}`);
          return false;
        }

        return ROLE_PERMISSIONS[role][module][action];
      });
    },
    [roles],
  );

  // // memoize to prevent recalculating for every component that runs hasPermission
  // const permissionMap = useMemo(() => {
  //   const map = {} as Record<
  //     keyof MODULE_PERMISSIONS,
  //     Record<MODULE_ACTIONS, boolean>
  //   >;

  //   for (const module of MODULES) {
  //     map[module] = {} as Record<MODULE_ACTIONS, boolean>;
  //     for (const action of ACTIONS) {
  //       map[module][action] = roles.some((role) => {
  //         if (!ROLE_PERMISSIONS[role]) {
  //           console.error(`NOT A VALID ROLE: ${role}`);
  //           return false;
  //         }
  //         return ROLE_PERMISSIONS[role][module][action];
  //       });
  //     }
  //   }

  //   return map;
  // }, [roles]);

  // const hasPermission = useCallback(
  //   (module: keyof MODULE_PERMISSIONS, action: MODULE_ACTIONS) => {
  //     return permissionMap[module]?.[action] ?? false;
  //   },
  //   [roles],
  // );

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, login, logout, roles, hasPermission }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
