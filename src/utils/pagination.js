export const paginate = async (repository, page, limit) => {
    const [data, total] = await repository.findAndCount({
        skip: (page - 1) * limit,
        take: limit
    });
    return { data, total };
};