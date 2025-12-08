export const paginate = (items, page = 1, perPage = 10) => {
  const offset = (page - 1) * perPage;
  return items.slice(offset, offset + perPage);
};
