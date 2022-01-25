class ApiFeatures {
  constructor(query, queryString, categories) {
    this.query = query;
    this.queryString = queryString;
    this.categories = categories;
    console.log('********************');
    console.log(' ');
    console.log('this.queryString', this.queryString);
    console.log(' ');
    console.log('this.categories', this.categories);
    console.log(' ');
  }

  search() {
    console.log('search');
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
    console.log('filter');
    console.log(' ');
    const queryObj = { ...this.queryString };

    // Remove unnecessary fields from query string
    const excludedFields = ['page', 'keyword', 'limit'];
    excludedFields.forEach((el) => delete queryObj[el]);

    if (this.categories?.length > 0) {
      queryObj.category = {};
      queryObj.category.$in = this.categories;
    }
    console.log('queryObj', queryObj);
    // Filter for price and rating
    let queryStr = JSON.stringify(queryObj);

    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`);

    console.log('queryStr', queryStr);
    console.log(' ');

    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  sort() {
    console.log('sort');
    const sort = this.queryString.sort;
    this.query = this.query.sort(sort);
    return this;
  }

  paginate(limit) {
    console.log('paginate');
    console.log(' ');
    console.log('********************');
    const page = this.queryString.page * 1 || 1;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

module.exports = ApiFeatures;
