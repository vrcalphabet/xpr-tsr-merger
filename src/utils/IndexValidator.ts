import { IndexDefinition } from '../common/IndexDefinition';
import { z } from 'zod';

export default class IndexValidator {
  /** `index.json`のスキーマ */
  private static readonly schema = z.object({
    input: z.string().default('./'),
    output: z.string().default('./'),
    ignore: z.array(z.string()).default([]),
    pretty: z.boolean().default(false),
  });

  /**
   * `index.json`の内容をバリデートします。
   * @param input `index.json`の内容
   * @returns バリデートされた`index.json`の内容
   */
  public static validate(input: string): IndexDefinition {
    try {
      const index = JSON.parse(input);
      return this.schema.parse(index) satisfies IndexDefinition;
    } catch (e: any) {
      if (e instanceof z.ZodError) {
        throw new Error('`index.json`のスキーマが不正です。');
      } else {
        throw new Error('`index.json`の構文が不正です。');
      }
    }
  }
}
