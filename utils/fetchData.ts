const fetchData = async (
    url: string,
    headers: HeadersInit | undefined = {}
) => {
    try {
        const response = await fetch(url, { headers });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Fetching error:', error);
        throw error;
    }
};

export { fetchData };
