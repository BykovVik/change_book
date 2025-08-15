interface Telegram {
    WebApp: {
        initData: string;
        initDataUnsafe: any;
        version: string;
        platform: string;
        themeParams: {
            bg_color?: string;
            text_color?: string;
            hint_color?: string;
            link_color?: string;
            button_color?: string;
            button_text_color?: string;
        };
        isExpanded: boolean;
        viewportHeight: number;
        viewportStableHeight: number;
        headerColor: string;
        backgroundColor: string;
        isClosingConfirmationEnabled: boolean;
        sendData: (data: string) => void;
        close: () => void;
        expand: () => void;
        onEvent: (eventType: string, callback: () => void) => void;
        offEvent: (eventType: string, callback: () => void) => void;
        ready: () => void;
    };
}

interface Window {
    Telegram: Telegram;
}