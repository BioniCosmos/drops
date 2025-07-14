declare module 'abracadabra-cn' {
  export class Abracadabra {
    static TEXT: 'TEXT'
    static UINT8: 'UINT8'

    static ENCRYPT: 'ENCRYPT'
    static DECRYPT: 'DECRYPT'
    static AUTO: 'AUTO'

    /**
     * 创建一个 Abracadabra 实例
     * @param inputType - 默认 TEXT
     * @param outputType - 默认 TEXT
     */
    constructor(inputType?: 'TEXT' | 'UINT8', outputType?: 'TEXT' | 'UINT8')

    /**
     * 魔曰 传统加密模式
     * @param input - 输入的数据
     * @param mode - 指定模式
     * @param key - 指定密钥，默认是 ABRACADABRA
     * @param q - 指定是否在加密后省略标志位，默认不省略（false）
     * @return 成功返回 0，失败抛出异常
     */
    Input(
      input: string | Uint8Array,
      mode: 'ENCRYPT' | 'DECRYPT' | 'AUTO',
      key?: string,
      q?: boolean,
    ): number

    /**
     * 魔曰 获取加密/解密后的结果
     */
    Output(): string | Uint8Array

    /**
     * 魔曰 文言文加密模式
     * @param input - 输入的数据
     * @param mode - 指定模式
     * @param key - 指定密钥，默认是 ABRACADABRA
     * @param q - 指定是否为密文添加标点符号，默认添加（true）
     * @param r - 密文算法的随机程度，越大随机性越强，默认 50，最大 100，超过 100 将会出错
     * @param p - 指定是否强制生成骈文密文，默认 false
     * @param l - 指定是否强制生成逻辑密文，默认 false
     * @return 成功返回 0，失败抛出异常
     */
    Input_Next(
      input: string | Uint8Array,
      mode: 'ENCRYPT' | 'DECRYPT',
      key?: string,
      q?: boolean,
      r?: number,
      p?: boolean,
      l?: boolean,
    ): number
  }
}
