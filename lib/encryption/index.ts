import { Abracadabra } from 'abracadabra-cn'

export function encrypt(plaintext: string, key: string) {
  const abracadabra = new Abracadabra()
  abracadabra.Input_Next(plaintext, Abracadabra.ENCRYPT, key)
  return abracadabra.Output() as string
}

export function decrypt(ciphertext: string, key: string) {
  const abracadabra = new Abracadabra()
  abracadabra.Input_Next(ciphertext, Abracadabra.DECRYPT, key)
  return abracadabra.Output() as string
}
