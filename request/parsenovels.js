export function parseNovels(html) {
    const novels = [];
    const rows = html.split('<div class="list2"');
    
    for (let i = 1; i < rows.length; i++) {
        const row = rows[i]
        const urlMatch = row.match(/<a href="(.*?)" itemprop="url">/);

        const url = urlMatch ? urlMatch[1].trim() : '';
        
        if (url) {
            novels.push("https://www.quanben.io/"+url);
        }
    }
    
    return novels;
}