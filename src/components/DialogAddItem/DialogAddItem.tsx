import { useEffect, useState } from "react"
import { Colecao } from "../../interfaces/Colecao"
import { Theme, styled } from "@mui/material/styles"
import { ItemAcervo } from "../../interfaces/ItemAcervo"
import { Button, Checkbox, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, FormControlLabel, List, ListItem, ListItemText, ListSubheader, Typography } from "@mui/material"
import useTheme from "@mui/material/styles/useTheme"
import useListItems from "../../hooks/useListItems"

interface DialogAddItemsProps {
  itensInicias: Map<Colecao, ItemAcervo[]>,
  setItens: (itens: Map<Colecao, ItemAcervo[]>) => void,
  open: boolean,
  closeDialog: () => void
}

const DialogAddItem = ({ itensInicias, setItens, open, closeDialog }: DialogAddItemsProps) =>{
  const theme = useTheme()

  const listItems = useListItems(false)

  const [itensSelecionados, setItensSelecionados] = useState<Map<Colecao, ItemAcervo[]>>(itensInicias || new Map())
  
  const [itensCompletos, setItensCompletos] = useState<Map<Colecao,ItemAcervo[]>>(listItems.data || new Map())

  const handleColectionChecked = (colection: Colecao) =>{
    const items = itensSelecionados.get(colection)
    const isEqual = items?.length === colection.itens?.length

    const newItems = new Map(itensSelecionados)
    newItems.set(colection, isEqual ? [] : [...(itensCompletos.get(colection) || [])])
    
    setItensSelecionados(newItems)
  }

  const handleItemChecked = (colection: Colecao, item: ItemAcervo) =>{
    const items = itensSelecionados.get(colection)
    const newItems = new Map(itensSelecionados)

    newItems.set(colection, items?.some(i => i.nome === item.nome) ? items.filter(i => i.nome !== item.nome) : [...(items || []), item])

    setItensSelecionados(newItems)
  }

  useEffect(() =>{
    const checkNullItems = Array.from(listItems.data.entries()).filter(([_, value]) => value.length > 0)

    setItensCompletos(new Map(checkNullItems))
    setItensSelecionados(itensInicias)
  },[listItems.data, listItems.status,])

  return(
    <Dialog 
      open={open} 
      aria-labelledby="alert-dialog-title"
      onClose={() => setItens(itensSelecionados)}
      PaperProps={{
        style:{
          backgroundColor: `${theme.palette.surfaceContainerHigh.main}`,
          borderRadius: '28px',
          display: 'inline-flex',
          width: '280px',
          maxWidth: '560px',
        }
      }}
    >
      <DialogTitle
        sx={{display: 'flex', padding: '24px', flexDirection: 'column', alignItems: 'flex-start', gap: '16px', alignSelf: 'stretch'}}
      >
        <Typography 
          variant="headlineSmall"
          color={theme.palette.onSurface.main}>
          Adicionar item à exposição
        </Typography>
        <DialogContentText>
          <Typography
            variant="bodyMedium"
            color={theme.palette.onSurface.main}
          >
            Selecione os itens para adicionar a uma exposição
          </Typography>
        </DialogContentText>
      </DialogTitle>
      <DialogContent data-cy="dialog-content">
        <List
          sx={{display: 'flex', maxHeight: '280px', flexDirection: 'column', alignItems: 'center', alignSelf: 'stretch'}}
          subheader={<li/>}
        >
          {
            Array.from(itensCompletos.entries()).map(([key, value]: [Colecao, ItemAcervo[]])=>(
              <List key={`Colection ${key.id}`} data-cy="list-checkbox">
                <ListSubheader
                  sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: `${theme.palette.surfaceContainerHigh.main}`}}
                  >
                  <Typography
                    variant="titleSmall"
                    color={theme.palette.onSurfaceVariant.main}
                    >
                    {key.nome}
                  </Typography>
                  <Typography
                    variant="bodySmall"
                    color={theme.palette.onSurfaceVariant.main}
                    sx={{textAlign: 'center'}}
                    >
                    Selecionar todos
                  </Typography>
                  <FormControlLabel 
                    label=""
                    data-cy="colecao-checkbox"
                    control={
                      <Checkbox 
                        checked={itensSelecionados?.get(key)?.length === itensCompletos?.get(key)?.length}
                        onChange={() => handleColectionChecked(key)}
                      />
                    }
                  />
                  </ListSubheader>
                  {
                    value.map(item =>(
                      <ListItem
                      key={`${item.id}`}
                      sx={{display: 'flex', justifyContent: 'space-around', alignItems: 'center', alignSelf: 'stretch'}}
                      >
                        <ListItemText primary={item.nome}/>
                        <FormControlLabel
                          label=""
                          data-cy="item-checkbox"
                          control={
                            <Checkbox
                              checked={itensSelecionados?.get(key)?.some(i => i.nome === item.nome) || itensSelecionados?.get(key)?.length === itensCompletos?.get(key)?.length}
                              onChange={() => handleItemChecked(key, item)}
                              size="small"
                            />
                          }
                        />
                      </ListItem>
                    ))
                  }
                </List>
            ))
          }
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => closeDialog()}>
          <Typography
            variant="labelLarge"
            color={theme.palette.inverseSurface.main}
          >
            Cancelar
          </Typography>
        </Button>
        <Button onClick={() => closeDialog()}>
        <Typography
            variant="labelLarge"
            color={theme.palette.primary.main}
          >
            Adicionar
          </Typography>
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default DialogAddItem