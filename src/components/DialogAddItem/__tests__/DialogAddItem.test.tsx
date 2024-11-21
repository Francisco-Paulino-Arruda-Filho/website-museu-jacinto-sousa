import { ThemeProvider } from "@emotion/react"
import { CssBaseline, createTheme } from "@mui/material"
import { BrowserRouter } from "react-router-dom"
import getDesignTokens from "../../../theme/theme"
import DialogAddItem from "../DialogAddItem"
import { ItemAcervo } from "../../../interfaces/ItemAcervo"
import { Colecao } from "../../../interfaces/Colecao"
import { useEffect, useState } from "react"
import { getAuth } from "firebase/auth"
import { app } from "../../../../firebase/firebase"
import { adicionarItemAcervo } from "../../../Utils/itemAcervoFirebase"

const theme = createTheme(getDesignTokens('light'))

const auth = getAuth(app)

const item1: ItemAcervo = {
  nome: "item1",
  descricao: "Descrição do item1",
  curiosidades: "Curiosidades sobre o item1",
  dataDoacao: new Date('2024-08-08'),
  colecao: "Coleção teste",
  doacao: false,
  doacaoAnonima: false,
  nomeDoador: "Tester",
  telefoneDoador: "9999-9999",
  privado: false,
  imagens: []
}

const item2: ItemAcervo = {
  nome: "item2",
  descricao: "Descrição do item2",
  curiosidades: "Curiosidades sobre o item2",
  dataDoacao: new Date('2024-08-08'),
  colecao: "Coleção teste",
  doacao: false,
  doacaoAnonima: false,
  nomeDoador: "Tester",
  telefoneDoador: "9999-9999",
  privado: false,
  imagens: []
}

const colecaoTeste: Colecao = {
  id: "colecoes/publico/lista/Q8Gk9vNpof9gANpo19yP",
  nome: "Coleção Testando",
  descricao: "Descrição da coleção teste",
  privado: false,
  itens: [item1, item2]
}

const setItens = async () =>{
  await adicionarItemAcervo(item1, colecaoTeste)
  await adicionarItemAcervo(item2, colecaoTeste)
}

function mockColection(){
  const mockMap = new Map<Colecao, ItemAcervo[]>()

  mockMap.set(colecaoTeste, [item1, item2])

  return mockMap
}

const DialogTest = () =>{
  return(
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline>
          <DialogAddItem itensInicias={mockColection()} setItens={([]) =>{}} open={true} closeDialog={() => {}}/>
        </CssBaseline>
      </ThemeProvider>
    </BrowserRouter>
  )
}

describe("Testando componente DialogAddItem", () =>{
  context("Versão Desktop", () =>{
    beforeEach(() =>{
      cy.viewport(1366, 768)
      cy.loginComponent(auth, 'test@mail', 'testpassword').then( async() =>{
        await setItens()
      })
    })
    it("Testa scroll na versão mobile", () =>{
      cy.mount(<DialogTest/>)

      cy.get("[data-cy='dialog-content']").scrollTo('bottom')
    })
    it("Testa seleção da checkbox da coleção", () =>{
      cy.mount(<DialogTest/>)

      cy.get("[data-cy='list-checkbox']").first().within(() =>{
        cy.get("[data-cy='colecao-checkbox']").first().click()
        cy.get("[data-cy='item-checkbox']").find("input").each((item) =>{
          cy.wrap(item).should("be.checked")
        })
      })

    })
  })
  context("Versão Mobile", () =>{
    beforeEach(() =>{
      cy.viewport("samsung-s10")
      cy.loginComponent(auth, 'test@mail', 'testpassword').then( async() =>{
        await setItens()
      })
    })
    it("Testa scroll na versão mobile", () =>{
      cy.mount(<DialogTest/>)

      cy.get("[data-cy='dialog-content']").scrollTo('bottom')
    })
    it("Testa seleção da checkbox da coleção", () =>{
      cy.mount(<DialogTest/>)

      cy.get("[data-cy='list-checkbox']").first().within(() =>{
        cy.get("[data-cy='colecao-checkbox']").first().click()
        cy.get("[data-cy='item-checkbox']").find("input").each((item) =>{
          cy.wrap(item).should("be.checked")
        })
      })

    })
  })
})