# @grigoreo-fox/n8n-nodes-telegram-webapp-auth

This is an n8n community node. It lets you validate Telegram WebApp init data in your n8n workflows.

Telegram WebApp Auth provides secure authentication and data validation for Telegram Mini Apps (Web Apps), allowing you to verify that data coming from your Telegram bot's web interface is legitimate and hasn't been tampered with.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/sustainable-use-license/) workflow automation platform.

[Installation](#installation)  
[Operations](#operations)  
[Credentials](#credentials)  
[Compatibility](#compatibility)  
[Usage](#usage)  
[Resources](#resources)  
[Version history](#version-history)

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

The package name is:

```
@grigoreo-fox/n8n-nodes-telegram-webapp-auth
```

## Operations

This node performs validation of Telegram WebApp init data:

- **Validate Init Data** - Validates the init data string received from a Telegram Mini App using your bot's token
  - Parses the init data to extract user information, query parameters, and other metadata
  - Cryptographically validates the data signature to ensure authenticity
  - Returns parsed data for valid requests
  - Optionally routes failed validations to a separate output for error handling

## Credentials

This node uses the standard **Telegram API** credentials from n8n.

### Prerequisites

1. Create a Telegram bot using [@BotFather](https://t.me/botfather)
2. Obtain your bot token from BotFather
3. Set up a Web App for your bot (using `/newapp` command in BotFather or by setting a web_app button)

### Setting up credentials in n8n

1. In your n8n workflow, add the Telegram WebApp Auth node
2. Click on **Select Credential** > **Create New Credential**
3. Select **Telegram API**
4. Enter your bot token in the **Access Token** field
5. Save the credentials

The bot token is used to validate that the init data was actually sent by Telegram and hasn't been modified.

## Compatibility

- **Minimum n8n version:** 1.0.0
- **Tested with:** n8n v1.0.0+
- **Node API version:** 1

This node uses the `@tma.js/init-data-node` library for validation, which follows Telegram's official authentication protocol.

## Usage

### Basic Validation

1. Add the **Telegram WebApp Auth** node to your workflow
2. Connect it after receiving data from your Telegram Mini App
3. Set the **Init Data** field to the init data string (usually from a webhook or API request)
   - You can use expressions like `{{ $json.initData }}` to reference data from previous nodes
4. Configure credentials with your bot token

The node will output:
- `isValid: true` with parsed user data if validation succeeds
- `isValid: false` with a `reason` field if validation fails

### Advanced: Separate Failed Output

Enable **Add Separate Failed Output** in the Additional Fields section to:
- Route successful validations to the first output
- Route failed validations to the second output
- Build different workflows for valid vs invalid requests

### Example Response

**Successful validation:**
```json
{
  "isValid": true,
  "data": {
    "authDate": 1234567890,
    "queryId": "AAHdF6IQAAAAAN0XohDhrOrc",
    "user": {
      "id": 123456789,
      "firstName": "John",
      "lastName": "Doe",
      "username": "johndoe",
      "languageCode": "en"
    },
    "hash": "abc123..."
  }
}
```

**Failed validation:**
```json
{
  "isValid": false,
  "reason": "Invalid signature"
}
```

## Resources

- [n8n community nodes documentation](https://docs.n8n.io/integrations/#community-nodes)
- [Telegram Mini Apps Documentation](https://core.telegram.org/bots/webapps)
- [Telegram WebApp Init Data Validation](https://core.telegram.org/bots/webapps#validating-data-received-via-the-mini-app)
- [@tma.js/init-data-node library](https://github.com/Telegram-Mini-Apps/tma.js)

## Version history

### 0.1.0 (Current)

Initial release with core functionality:
- Init data validation using bot token
- Parsing of Telegram user data
- Optional separate output for failed validations
- Support for all standard Telegram WebApp init data fields
