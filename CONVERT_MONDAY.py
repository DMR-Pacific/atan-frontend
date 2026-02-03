import pandas as pd
import json
import math

# ===== INSTRUCTIONS =====
#  export table from monday
# ensure file exists in project directory as MONDAY_DATA.xlsx
# run using
# python CONVERT_MONDAY.py
# ==============

# Load Excel file
df = pd.read_excel("MONDAY_DATA.xlsx", sheet_name="order tracking", skiprows=3)


# for index, row in df.iterrows():
#     print(row)

n_rows = len(df)
# n_rows = 80

i = 0

data = []
category = 0

def safe_val(val):
    # Replace NaN (or None) with empty string
    return "" if val is None or (isinstance(val, float) and math.isnan(val)) else val

def convert_client_order_row (client_row):
    return {
        "label": safe_val(client_row[0]),
        "assignedToIdList": safe_val(client_row[2]),
        "statusId": safe_val(client_row[3]),
        "priorityId": safe_val(client_row[5]),
        "clientTypeId": safe_val(client_row[11]),
        "categoryId": category,
        "dueDate": safe_val(client_row[4]),
        "notes": safe_val(client_row[6]),
        "value": safe_val(client_row[10]),
        "dmrOrders": [],
    }

def convert_dmr_order_row(dmr_row):
    return {
        "label": safe_val(dmr_row[1]),
        "statusId": safe_val(dmr_row[3]),
        "orderDate": safe_val(dmr_row[4]),
        "estimatedArrival": safe_val(dmr_row[5]),
        "notes": safe_val(dmr_row[6]),
        "assignedToIdList": safe_val(dmr_row[2]),


    }

while i < n_rows:
    row_values = df.iloc[i].tolist()
    # check for primary tables header
    if (row_values[0] == 'Name' and row_values[1] == 'Subitems'):
        # print("++++++++++ PRIMARY TABLE HEADER ++++++++++")
        i+=1 
        category +=1 # increment category so we know these set of client orders belong to the next category
        print("SKIPPED ----------", row_values )
        continue


    # check for subitems header
    if (row_values[0] == 'Subitems'):
        # print("======SUBITEMS HEADER=====")
        i+=1 # move to next row

        # process column as subitem if first column is NaN
        while i < n_rows and pd.isna(df.iloc[i].tolist()[0]):
            subitem_values = df.iloc[i].tolist()
            # print(f"----------------- Subitem row {i}: {subitem_values}")
            data[-1]["dmrOrders"].append(convert_dmr_order_row(subitem_values))
            i+=1

        continue

    client_order_obj = convert_client_order_row(row_values)

    # ======== ROWS TO IGNORE
    # ----- Ignore if empty
    if client_order_obj == {
        "label": "",
        "assignedToIdList": "",
        "statusId": "",
        "dueDate": "",
        "priorityId": "",
        "notes": "",
        "value": "",
        "clientTypeId": "",
        "dmrOrders": []
    }:
        i+=1 
        continue

    # ----- there are summary rows at the end of each table, can be identified by dueDate has 'to' in it
    # "dueDate": "2025-11-12 to 2026-07-04",
    if 'to' in str(client_order_obj['dueDate']):
        i+=1 
        print("SKIPPED ----------", row_values )

        continue

    # ------ title rows 
    if client_order_obj['label'] == "Pending Delivery" or client_order_obj['label'] == "Completed" or client_order_obj['label'] == "Issue/Lead Tracking" or client_order_obj['label'] == "To-Do":
        i+=1 
        print("SKIPPED ----------", row_values )

        continue

    # ==========================================

    # Regular processing for normnal rows
    # print(f"Normal row {i}: {row_values}")
    data.append(convert_client_order_row(row_values))
    i+=1


REF_STATUS = {
    "Delivered": 1,
    "Landed": 2,
    "Working on it": 3,
    "Stuck": 4,
    "Unkown": 5,
    "Not Yet Ordered": 6,
}
REF_PRIORITY = {
    "Critical \u26a0\ufe0f\ufe0f": 1,
    "High": 2,
    "Medium": 3,
    "Low": 4,
}

REF_CLIENT_TYPE = {
    "B2B": 1,
    "Consumer": 3,
    "GOV": 2,
}

MAP_USERS = {
    "Cade Taitano": 22,
    "Richard Taitano": 21,
    "Noah Elbo": 23,
}

def clean_assigned_to(client):
    list_owner_names = client.get("assignedToIdList", "").split(",")
    list_owner_ids = []


    for name in list_owner_names: 
        if MAP_USERS.get(name, '') != '':
            list_owner_ids.append(MAP_USERS.get(name, ''))
    client["assignedToIdList"] = list_owner_ids

def clean_client(client):
    # Map references from string to actual database ID using the mapping objects
    client["statusId"] = REF_STATUS.get(client["statusId"], '')
    client["priorityId"] = REF_PRIORITY.get(client["priorityId"], '')
    client["clientTypeId"] = REF_CLIENT_TYPE.get(client["clientTypeId"], '')

    # clean assigned users
    clean_assigned_to(client)

    # clean dueDate
    client["dueDate"] = str(client["dueDate"]).split(" ")[0]
   
    # owner use id's

    return client

def clean_dmr(dmr):
    dmr["statusId"] = REF_STATUS.get(dmr["statusId"], '')

    clean_assigned_to(dmr)
    dmr["orderDate"] = str(dmr["orderDate"]).split(" ")[0]
    dmr["estimatedArrival"] = str(dmr["estimatedArrival"]).split(" ")[0]

#  cleanup
for item in data:
    clean_client(item)
    # print(item)
    if len(item["dmrOrders"]) > 0:
        for subitem in item["dmrOrders"]:
            clean_dmr(subitem)
            # print(f"------------ {subitem}")

    # print("\n")








with open("CONVERT_OUTPUT.json", "w", encoding="utf-8") as f:
    json.dump(data, f, indent=4, default=str)