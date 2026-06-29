"use strict"

module.exports = (req, res, next) => {

    /* FILTERING & SEARCHING & SORTING & PAGINATION */

    // ### FILTERING ###

    // URL?filter[key1]=value1&filter[key2]=value2
    const filter = req.query?.filter || {}
    // console.log(filter)

    // ### SEARCHING ###

    // URL?search[key1]=value1&search[key2]=value2
    // https://www.mongodb.com/docs/manual/reference/operator/query/regex/
    const search = req.query?.search || {}
    // console.log(search)
    // const example = { title: { $regex: 'test', $options: 'i' } } // const example = { title: /test/ }
    for (let key in search) search[key] = { $regex: search[key], $options: 'i' } // i: case insensitive
    
    // console.log(search)

    // ### SORTING ###

    // URL?sort[key1]=asc&sort[key2]=desc
    // asc: A-Z - desc: Z-A
    const sort = req.query?.sort || {}
    // console.log(sort)

    for (let key in sort) {
        if (sort[key] === "1" || sort[key] === "asc") {
            sort[key] = 1; // Pure numeric ascending directional pointer
        } else if (sort[key] === "-1" || sort[key] === "desc") {
            sort[key] = -1; // Pure numeric descending directional pointer
        }
    }
    
    // Default sort by newest first:
    if (!Object.keys(sort).length) {
        sort.createdAt = -1 // Default sorting by creation date (newest first)
    }

    // ### PAGINATION ###

    //* LIMIT
    // URL?page=3&limit=10
    let limit = Number(req.query?.limit)
    // console.log(limit)
    limit = limit > 0 ? limit : Number(process.env.PAGE_SIZE || 24)
    // console.log(typeof limit, limit)

    //* PAGE
    let page = parseInt(req.query?.page)
    page = page > 0 ? page : 1 
    // console.log(typeof page, page)

    //* SKIP
    let skip = parseInt(req.query?.skip)
    skip = skip > 0 ? skip : (page - 1) * limit
    // console.log(typeof skip, skip)

    /* FILTERING & SEARCHING & SORTING & PAGINATION */

    // Run for output:
    res.getModelList = async (Model, customFilter = {}, populate = null) => {
        return await Model.find({ ...filter, ...search, ...customFilter }).sort(sort).skip(skip).limit(limit).populate(populate)
    }

    // Details:
    res.getModelListDetails = async (Model, customFilter = {}) => {

        const count = await Model.countDocuments({ ...filter, ...search, ...customFilter })

        let details = {
            filter,
            search,
            sort,
            skip,
            limit,
            page,
            totalRecords: count,
            pages: count <= limit ? false : {
                prev: (page > 1 ? page - 1 : false),
                current: page,
                next: page < Math.ceil(count / limit) ? page + 1 : false,
                total: Math.ceil(count / limit)
            },
        }
        // details.pages.next = (details.pages.next > details.pages.total ? false : details.pages.next)
        // if (details.totalRecords <= limit) details.pages = false
        return details
    }
    
    next()
}