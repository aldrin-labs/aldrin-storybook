import {
  apolloCachePersist,
  idTokens,
  persistRoot,
} from './persist'

export const autoLogin = async (storage) => {
  await storage.setItem('token', idTokens[0])
  await storage.setItem('apollo-cache-persist',
    JSON.stringify(apolloCachePersist)
  )
  await storage.setItem('persist:root',
    JSON.stringify(persistRoot)
  )
}