import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::blog.blog', ({ strapi }) => ({
  async fixLocales(ctx) {
    const detectLanguage = (text: string) => {
      if (!text) return 'en';
      if (/[\u3040-\u309f\u30a0-\u30ff]/.test(text)) return 'ja';
      if (/[\u0600-\u06ff]/.test(text)) return 'ar';
      if (/[\u4e00-\u9fff]/.test(text) && !/[\u3040-\u30ff]/.test(text)) return 'zh';
      if (/[äöåÄÖÅ]/.test(text) && /\b(ja|on|ei|kanssa|yli)\b/i.test(text)) return 'fi';
      if (/[ñ¿¡]/.test(text) || (/[áéíóúü]/i.test(text) && /\b(el|la|los|las|del|una)\b/i.test(text))) return 'es';
      return 'en';
    };

    try {
      const blogs = await strapi.db.query('api::blog.blog').findMany({
        select: ['id', 'title', 'locale'],
      });

      let fixed = 0;
      const results: any[] = [];

      for (const blog of blogs) {
        const detectedLocale = detectLanguage(blog.title);
        if (blog.locale !== detectedLocale) {
          await strapi.db.query('api::blog.blog').update({
            where: { id: blog.id },
            data: { locale: detectedLocale }
          });
          results.push({ title: blog.title.substring(0, 40), from: blog.locale, to: detectedLocale });
          fixed++;
        }
      }

      ctx.body = { total: blogs.length, fixed, results };
    } catch (error: any) {
      ctx.throw(500, error.message);
    }
  }
}));
