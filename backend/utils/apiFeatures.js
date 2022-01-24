class ApiFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
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
    console.log('keyword', keyword);

    this.query = this.query.find(keyword ? { $or: keyword } : {});
    return this;
  }

  filter() {
    const queryObj = { ...this.queryString };

    // Remove unnecessary fields from query string
    const excludedFields = ['page', 'keyword', 'limit'];
    excludedFields.forEach((el) => delete queryObj[el]);

    // Filter for price and rating
    let queryStr = JSON.stringify(queryObj);

    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`);

    this.query = this.query.find(JSON.parse(queryStr));

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
