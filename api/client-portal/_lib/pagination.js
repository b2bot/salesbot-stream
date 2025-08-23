
export function normalizePagination(query) {
  const page = parseInt(query.page) || 1;
  const limit = Math.min(parseInt(query.limit) || 10, 100); // máximo 100 itens por página
  const offset = (page - 1) * limit;

  return { page, limit, offset };
}

export function buildPaginationResponse(items, total, page, limit) {
  return {
    items,
    page,
    limit,
    total,
    hasMore: (page * limit) < total
  };
}
