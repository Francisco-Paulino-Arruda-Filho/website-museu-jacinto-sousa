import { useEffect, useState } from "react"
import useNomeColecoes from "./useColecoes"
import { ClientColecoesFirebase } from "../Utils/colecaoFirebase"
import { Colecao } from "../interfaces/Colecao"
import { ItemAcervo } from "../interfaces/ItemAcervo"

const useListItems = (images: boolean) =>{
  const [data, setData] = useState<Map<Colecao, ItemAcervo[]>>(new Map())
  const [status, setStatus] = useState<string>("loading")

  const colectionsNames = useNomeColecoes()
  const clientColections = new ClientColecoesFirebase()

  useEffect(() =>{
    const fetchData = async () =>{
      try{
        const newData = new Map<Colecao, ItemAcervo[]>()
  
        await Promise.all(colectionsNames.map( async (colection) => {
          const itens =  await clientColections.getItensColecao(colection, undefined, images)
          console.log(itens)
          newData.set({...colection, itens}, itens)
        }))

        setData(newData)

        setStatus("sucess")
      }catch(error){
        setStatus("error")
      }
    }

    fetchData()
  }, [colectionsNames])

  return { status, data }
}

export default useListItems