"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const type_graphql_1 = require("type-graphql");
const CreateCategory_1 = require("./modules/category/CreateCategory");
const GetCategories_1 = require("./modules/category/GetCategories");
const CreateMajor_1 = require("./modules/major/CreateMajor");
const GetMajors_1 = require("./modules/major/GetMajors");
exports.default = (Container) => {
    return (0, type_graphql_1.buildSchema)({
        container: Container,
        resolvers: [CreateCategory_1.CreateCategory, GetCategories_1.GetCategories, CreateMajor_1.CreateMajor, GetMajors_1.GetMajors],
    });
};
//# sourceMappingURL=Schema.js.map