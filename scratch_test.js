async function test() {
    const handles = [
        "@FFK_Prasanth",
        "@FFKPrasanth_Shorts",
        "@FFKPrasanth_Live",
        "@ffkprasanth07",
        "@FFKDeepak-d9o"
    ];
    
    for (const handle of handles) {
        console.log(`Checking ${handle}...`);
        try {
            const url = `https://www.youtube.com/${handle}/live`;
            const proxyUrl = `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`;
            const response = await fetch(proxyUrl);
            if (!response.ok) {
                console.log(`- Fetch failed: ${response.status}`);
                continue;
            }
            const html = await response.text();
            
            const canonicalMatch = html.match(/<link rel="canonical" href="([^"]+)"/);
            const canonicalUrl = canonicalMatch ? canonicalMatch[1] : "NOT FOUND";
            const isWatchPage = canonicalUrl.includes("watch?v=");
            
            const isUpcoming = html.includes('"isUpcoming":true') || 
                               html.includes('isUpcoming":true') || 
                               html.includes('"style":"UPCOMING"') || 
                               html.includes('style":"UPCOMING"') || 
                               html.includes('upcomingEventData');
            
            const isLive = isWatchPage && !isUpcoming && (html.includes('"isLive":true') || html.includes('isLive":true'));
            
            console.log(`- Canonical URL: ${canonicalUrl}`);
            console.log(`- Redirected to Watch Page: ${isWatchPage}`);
            console.log(`- isUpcoming: ${isUpcoming}`);
            console.log(`- isLive: ${isLive}\n`);
            
        } catch (e) {
            console.error(e);
        }
    }
}

test();
