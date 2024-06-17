const dueTypeMap = {
    'payable': 2,
    'receivable': 1
}

export const getDueTypeID = (dueTypeName) => {
    return dueTypeMap[dueTypeName]
}

export const getDueTypeName = (dueTypeId) => {
    const entry = Object.entries(dueTypeMap).find(([key, value]) => value === dueTypeId)
    return entry ? entry[0] : null
}
