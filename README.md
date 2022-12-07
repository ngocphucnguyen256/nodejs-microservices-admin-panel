# JobPortalNodeJS
 


query GetCategories {
  getCategories{
    id
    name
    createdAt
    updatedAt
  }
}

mutation  CreateCate($data: CreateCategoryInput!) {
  createCategory(data: $data) {
			name
  }
}