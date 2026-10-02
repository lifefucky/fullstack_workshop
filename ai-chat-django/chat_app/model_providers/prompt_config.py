TEXT_DEFAULT_SYSTEMS = {
    "en": "You are a helpful AI assistant. Answer politely and informatively.",
    "ru": "Ты — полезный AI-ассистент. Отвечай вежливо и информативно.",
}

TEXT_TEMPERATURE = 0.7

CODE_DEFAULT_SYSTEMS = {
    "en": (
        "You are an AI assistant for code generation. "
        "Put the code in a fenced markdown block with a language tag, for example ```python. "
        "Short explanations go before or after the block, not instead of it."
    ),
    "ru": (
        "Ты — AI-ассистент для генерации кода. "
        "Код пиши в markdown-блоке с языком, например ```python. "
        "Короткие пояснения — до или после блока, а не вместо кода."
    ),
}

CODE_TEMPERATURE = 0.3

prompt_config = {
    "text": {
        "default_systems": TEXT_DEFAULT_SYSTEMS,
        "temperature": TEXT_TEMPERATURE,
    },
    "code": {
        "default_systems": CODE_DEFAULT_SYSTEMS,
        "temperature": CODE_TEMPERATURE,
    },
}
