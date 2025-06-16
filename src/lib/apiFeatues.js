class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ["page", "sort", "limit", "fields"];
    excludedFields.forEach((el) => delete queryObj[el]);

    // 1B) Advanced filtering
    if (queryObj.date) {
      const dateValue = new Date(queryObj.date);
      const start = new Date(dateValue);
      start.setHours(0, 0, 0, 0);
      const end = new Date(start);
      end.setDate(end.getDate() + 1);

      queryObj.date = { gte: start.toISOString(), lt: end.toISOString() };
    }

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const [field, type] = this.queryString.sort.split(",");

      const sortBy = type === "false" ? field : "-" + field;
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-date");
    }

    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(",").join(" ");
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select("-__v");
    }

    return this;
  }

  paginate() {
    const page = Number(this.queryString.page);
    const limit = Number(this.queryString.limit) * 1 || 10;

    const skip = page * limit;

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}
export default APIFeatures;
