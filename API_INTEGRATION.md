# AgriFlight Unified Agri-API Gateway Documentation

## Overview
The Unified Agri-API Gateway provides a centralized interface for AgriFlight to interact with both local and international agricultural data providers.

## Architecture
- **Gateway**: `server/services/api-gateway.cjs`
- **Adapters**: `server/services/external-apis/`
- **Caching**: `node-cache` (TTL: 10 mins)
- **Logging**: `pino`

## 1. Local API Integrations
### Line API (Messaging)
- **Purpose**: Real-time notifications to farmers.
- **Service**: `local.sendMessage(userId, text)`
- **Auth**: Channel Access Token (Env: `LINE_ACCESS_TOKEN`)

### Local Weather (TMD Style)
- **Purpose**: Field-specific weather alerts.
- **Service**: `local.getLocalWeather(province)`
- **Format**: Unified JSON (Temp, Humidity, Wind).

## 2. Partner API Integrations
### FarmOS
- **Purpose**: Syncing farm assets and field data.
- **Service**: `partners.getFarmAssets()`
- **Transformation**: Maps FarmOS `land` assets to unified `FIELD` objects.

### OpenAg
- **Purpose**: Accessing agricultural research and pest data.
- **Service**: `partners.getResearchData(cropType)`
- **Mapping**: Provides research-backed ideal conditions.

## 3. Data Mapping (Unified Schema)
All external field/asset data is mapped to the following format:
```json
{
  "externalId": "string",
  "unifiedName": "string",
  "category": "FIELD | STATION | EQUIPMENT",
  "provider": "string"
}
```

## 4. Error Handling & Retries
- **Retries**: Automatic 2-attempt retry for failed requests.
- **Caching**: Results are cached using a composite key `service:method:args`.
- **Logging**: All requests and cache hits are logged via Pino.

## 5. Troubleshooting
- **Cache Invalidation**: Restart the server or wait for TTL (10m).
- **Authentication**: Check `.env` for `LINE_ACCESS_TOKEN` and `FARMOS_URL`.
- **Logs**: Run with `DEBUG=pino:*` for verbose output.
