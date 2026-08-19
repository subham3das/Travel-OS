export class SlugUtil {
  public static generate(text: string): string {
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-') // Replace spaces with -
      .replace(/&/g, '-and-') // Replace & with 'and'
      .replace(/[^\w\-]+/g, '') // Remove all non-word chars
      .replace(/\-\-+/g, '-') // Replace multiple - with single -
      .replace(/^-+/, '') // Trim - from start of text
      .replace(/-+$/, ''); // Trim - from end of text
  }

  public static appendUniqueSuffix(slug: string): string {
    const randomSuffix = Math.random().toString(36).substring(2, 7);
    return `${slug}-${randomSuffix}`;
  }
}
