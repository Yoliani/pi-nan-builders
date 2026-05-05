# pi-nan-builders

Pi package that registers a custom OpenAI-compatible provider called **nan-builders**.

## Installation

```bash
pi install https://github.com/Yoliani/pi-nan-builders
```

## Environment Variables

Set these before running `pi`:

| Variable | Description | Default |
|---|---|---|
| `NAN_BUILDERS_URL` | Base URL of the OpenAI-compatible API | `https://api.nan.builders/v1` |
| `NAN_BUILDERS_API_KEY` | API key for authentication | _(none)_ |

Example:

```bash
export NAN_BUILDERS_URL="https://api.nan.builders/v1"
export NAN_BUILDERS_API_KEY="your-api-key-here"
```

## Usage

After installation, the `nan-builders` provider will be available in pi. Select a model with:

```bash
pi --model nan-builders/<model-id> "Your prompt"
```

Or use the interactive model selector (`Ctrl+L`) and pick a model from the **nan-builders** provider.

## Updating

```bash
# Update this package
pi update https://github.com/Yoliani/pi-nan-builders

# Or update all installed packages
pi update
```

## How It Works

At startup, the extension fetches `GET /models` from the configured base URL and registers each discovered model. If the endpoint is unreachable, it falls back to a single hardcoded default model and logs a warning.
