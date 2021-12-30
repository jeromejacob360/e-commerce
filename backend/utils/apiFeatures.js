class ApiFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  search() {
    const keyword = this.queryString.keyword
      ? {
          name: {
            $regex: this.queryString.keyword,
            $options: 'i',
          },
        }
      : {};

    this.query = this.query.find(keyword);
    return this;
  }

  filter() {
    const queryObj = { ...this.queryString };

    // Remove unnecessary fields from query string
    const excludedFields = ['page', 'keyword', 'limit'];
    excludedFields.forEach((el) => delete queryObj[el]);

    // Filter for price and rating
    // let queryStr = JSON.stringify(queryObj);
    // queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => '$' + key);
    // console.log(`queryStr`, queryStr);
    // this.query = this.query.find(JSON.parse(queryStr)); TODO

    this.query = this.query.find(queryObj);
    return this;
  }

  paginate() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 6;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

module.exports = ApiFeatures;
