class ApiFeatures {
  constructor(query, queryString, categories) {
    this.query = query;
    this.queryString = queryString;
    this.categories = categories;
  }

  search() {
    const keyword = this.queryString.keyword
      ? [
          {
            description: {
              $regex: this.queryString.keyword,
              $options: 'i',
            },
          },
          {
            name: {
              $regex: this.queryString.keyword,
              $options: 'i',
            },
          },
        ]
      : null;

    this.query = this.query.find(keyword ? { $or: keyword } : {});
    return this;
  }

  filter() {
    const queryObj = { ...this.queryString };

    // Remove unnecessary fields from query string
    const excludedFields = ['page', 'keyword', 'limit'];
    excludedFields.forEach((el) => delete queryObj[el]);

    if (this.categories?.length > 0) {
      queryObj.category = {};
      queryObj.category.$in = this.categories;
    }

    // Filter for price and rating
    let queryStr = JSON.stringify(queryObj);

    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`);

    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  sort() {
    const sort = this.queryString.sort;
    this.query = this.query.sort(sort);
    return this;
  }

  paginate(limit) {
    const page = this.queryString.page * 1 || 1;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

module.exports = ApiFeatures;
