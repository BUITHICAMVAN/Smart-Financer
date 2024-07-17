export const getSavingTypeName = (savingTypeId, savingTypes) => {
  const savingType = savingTypes.find(type => type.saving_type_id === savingTypeId);
  return savingType ? savingType.saving_type_name : 'Unknown';
};

export const getSavingTypeId = (savingTypeName, savingTypes) => {
  const savingType = savingTypes.find(type => type.saving_type_name === savingTypeName);
  return savingType ? savingType.saving_type_id : null;
};
