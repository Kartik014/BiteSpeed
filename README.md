# Bitespeed Backend Task: Identity Reconciliation

## Overview

The Identity Reconciliation task for Bitespeed involves identifying and tracking a customer's identity across multiple purchases on FluxKart.com. Each order on FluxKart contains an **email** or **phoneNumber** in the checkout event, and Bitespeed uses a relational database table called **Contact** to store and manage this contact information.

This project aims to provide a system that can reconcile and track the customer's identity by using either email or phone number from the checkout events to ensure consistent and accurate customer identification across purchases.

---

## Features

- **Track customer identity** across multiple purchases using contact information.
- Identify customers by **email** or **phone number**.
- Store contact information in a **relational database** using a `Contact` table.

---

## Requirements

- **Backend Framework**: Node.js / Express
- **Database**: PostgreSQL
- **Node.js version**: v16 or higher

---

## Database Schema

The **`Contact`** table should have the following structure:

### Table: Contact

| Column Name     | Data Type    | Description                                              |
|-----------------|--------------|----------------------------------------------------------|
| `id`            | INT          | Primary key, auto-incremented                            |
| `phoneNumber`   | VARCHAR(255) | Phone number of the customer (nullable)                  |
| `email`         | VARCHAR(255) | Email address of the customer (nullable)                 |
| `linkedId`      | INT          | The ID of another Contact linked to this one (nullable)  |
| `linkPrecedence`| ENUM         | "primary" if it's the first Contact in the link, "secondary" otherwise (default: 'secondary') |
| `createdAt`     | TIMESTAMP    | Date and time when the contact record was created        |
| `updatedAt`     | TIMESTAMP    | Date and time when the contact record was last updated   |
| `deletedAt`     | TIMESTAMP    | Date and time when the contact record was deleted (nullable) |

The **`linkedId`** column allows a customer’s contact information to be linked to another contact record, and **`linkPrecedence`** determines whether the linked contact is the primary or secondary contact.

---

## API Endpoints

### 1. Create or Update Contact Information

**POST** `/contact/identify`

This endpoint will create a new contact record or update an existing one with the given **email** or **phoneNumber**.

#### Request Body

```json
{
  "email": "customer@example.com",
  "phoneNumber": "1234567890"
}
```
---

## Resume

For more details about my experience and skills, you can check my resume:

📄 [Kartik Agarwal_Resume](https://drive.google.com/file/d/1Cc-4ah8RcZNJpIwmqfJS4dxDJVDRwBVU/view?usp=drive_link)

