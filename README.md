# About
An Identity Reconciliation web service to identify and keep track of a customer's identity across multiple purchases.

# Requirements
- Node.js v20.0.0 or higher

# Getting Started
- Clone the repository
```
git clone https://github.com/meetakbari/identity-reconciliation-api.git
```
- Install dependencies
```
cd identity-reconciliation-api
npm install
```
- Build and run the project
```
npm run dev
```

# Tech Stack 
- Node.js 
- Typescript
- PostgreSQL
- TypeORM

# Database Tables Schema
## Contact
```
{
    id                   Int                   
    phoneNumber          String?
    email                String?
    linkedId             Int? // the ID of another Contact linked to this one
    linkPrecedence       "secondary"|"primary" // "primary" if it's the first Contact in the link
    createdAt            DateTime              
    updatedAt            DateTime              
    deletedAt            DateTime?
}
```

# API Endpoints
### POST /api/v1/contacts/identify
#### Request Body Format
```
{
	"email"?: string,
	"phoneNumber"?: string
}
```

#### Response Object Format
```
{
		"contact":{
			"primaryContatctId": number,
			"emails": string[], // first element being email of primary contact 
			"phoneNumbers": string[], // first element being phoneNumber of primary contact
			"secondaryContactIds": number[] // Array of all Contact IDs that are "secondary" to the primary contact
		}
	}
```

