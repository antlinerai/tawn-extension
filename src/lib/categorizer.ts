import type { CategoryKey } from '../types';

const DOMAIN_MAP: Record<string, CategoryKey> = {
  'gmail.com': 'work', 'mail.google.com': 'work', 'calendar.google.com': 'work',
  'meet.google.com': 'work', 'docs.google.com': 'work', 'drive.google.com': 'work',
  'notion.so': 'work', 'atlassian.com': 'work', 'jira.com': 'work',
  'slack.com': 'work', 'linear.app': 'work', 'asana.com': 'work',
  'trello.com': 'work', 'monday.com': 'work', 'clickup.com': 'work',
  'figma.com': 'work', 'zoom.us': 'work', 'teams.microsoft.com': 'work',
  'github.com': 'dev', 'gitlab.com': 'dev', 'bitbucket.org': 'dev',
  'stackoverflow.com': 'dev', 'vercel.com': 'dev', 'netlify.com': 'dev',
  'npmjs.com': 'dev', 'dev.to': 'dev', 'codepen.io': 'dev',
  'supabase.com': 'dev', 'mongodb.com': 'dev', 'codesandbox.io': 'dev',
  'aws.amazon.com': 'dev', 'digitalocean.com': 'dev', 'heroku.com': 'dev',
  'paypal.com': 'finance', 'stripe.com': 'finance', 'coinbase.com': 'finance',
  'binance.com': 'finance', 'robinhood.com': 'finance', 'zerodha.com': 'finance',
  'groww.in': 'finance', 'paytm.com': 'finance', 'phonepe.com': 'finance',
  'netflix.com': 'entertainment', 'primevideo.com': 'entertainment',
  'hotstar.com': 'entertainment', 'disneyplus.com': 'entertainment',
  'hulu.com': 'entertainment', 'aha.video': 'entertainment',
  'youtube.com': 'entertainment', 'twitch.tv': 'entertainment',
  'spotify.com': 'entertainment', 'soundcloud.com': 'entertainment',
  'amazon.com': 'shopping', 'amazon.in': 'shopping', 'flipkart.com': 'shopping',
  'ebay.com': 'shopping', 'etsy.com': 'shopping', 'myntra.com': 'shopping',
  'meesho.com': 'shopping', 'ajio.com': 'shopping', 'zomato.com': 'shopping',
  'swiggy.com': 'shopping',
  'webmd.com': 'health', 'mayoclinic.org': 'health', 'healthline.com': 'health',
  'twitter.com': 'social', 'x.com': 'social', 'facebook.com': 'social',
  'instagram.com': 'social', 'linkedin.com': 'social', 'reddit.com': 'social',
  'discord.com': 'social', 'threads.net': 'social', 'pinterest.com': 'social',
  'news.google.com': 'news', 'bbc.com': 'news', 'cnn.com': 'news',
  'techcrunch.com': 'news', 'theverge.com': 'news', 'medium.com': 'news',
  'news.ycombinator.com': 'news',
  'coursera.org': 'learning', 'udemy.com': 'learning', 'pluralsight.com': 'learning',
  'edx.org': 'learning', 'khanacademy.org': 'learning', 'frontendmasters.com': 'learning',
  'egghead.io': 'learning',
};

export function categorizeUrl(url: string): CategoryKey {
  try {
    const { hostname } = new URL(url);
    const domain = hostname.replace(/^www\./, '');
    if (DOMAIN_MAP[domain]) return DOMAIN_MAP[domain];
    for (const [key, cat] of Object.entries(DOMAIN_MAP)) {
      if (domain.endsWith(`.${key}`) || domain.includes(key)) return cat;
    }
    return 'personal';
  } catch {
    return 'personal';
  }
}

export function getDomainSubsection(url: string): string | undefined {
  try {
    const { hostname } = new URL(url);
    const domain = hostname.replace(/^www\./, '');
    const subsections: Record<string, string> = {
      'github.com': 'GitHub', 'gitlab.com': 'GitLab',
      'atlassian.com': 'Jira', 'jira.com': 'Jira',
      'gmail.com': 'Gmail', 'notion.so': 'Notion', 'notion.com': 'Notion',
      'netflix.com': 'Netflix', 'primevideo.com': 'Prime Video',
      'youtube.com': 'YouTube', 'spotify.com': 'Spotify',
      'amazon.com': 'Amazon', 'amazon.in': 'Amazon', 'flipkart.com': 'Flipkart',
    };
    return subsections[domain];
  } catch { return undefined; }
}
