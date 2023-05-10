import './App.css';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import { useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

const columns = [
  {
    field: 'nome',
    headerName: 'Nome',
    editable: false,
    flex: 1,
    align: 'center',
    headerAlign: 'center',
  },
  {
    field: 'descricao',
    headerName: 'Descrição',
    flex: 1,
    editable: false,
    align: 'center',
    headerAlign: 'center',
  },
  {
    field: 'preco_venda',
    headerName: 'Preço de Venda',
    type: 'number',
    editable: false,
    flex: 1,
    align: 'center',
    headerAlign: 'center',
  },
  {
    field: 'preco_compra',
    headerName: 'Preço de Compra',
    type: 'number',
    flex: 1,
    align: 'center',
    headerAlign: 'center',
  },
  {
    field: 'estoque',
    headerName: 'Estoque',
    type: 'number',
    flex: 1,
    align: 'center',
    headerAlign: 'center',
  },
];

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
};

function App() {
  const [rows, setRows] = useState([])
  const [produtoAdd, setProdutoAdd] = useState({
    nome: '',
    descricao: '',
    preco_venda: null,
    preco_compra: null,
    estoque: null
  })
  const [produtoView, setProdutoView] = useState({
    id: null,
    nome: '',
    descricao: '',
    preco_venda: null,
    preco_compra: null,
    estoque: null
  })
  const [selectedRows, setSelectedRows] = useState([])
  const [open, setOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    listaProdutos();
  }, []);

  const listaProdutos = async () => {
    try {
      const response = await axios.get('http://localhost:8000/produtos');
      console.log('produtos: ', response);
      if (response.status === 200) {
        if (response.data && response.data.length > 0) {
          setRows(response.data[0].produtos)
        }
      }
    } catch (e) {

    }
  }

  const getProduto = async (idProduto) => {
    try {
      console.log(idProduto)
      if (idProduto) {
        const response = await axios.get('http://localhost:8000/produto', {
          params: { id: idProduto },
        });

        if (response.status === 200) {
          console.log(response);
          if (response.data && response.data.length > 0) {
            setProdutoView({
              id: response.data[0].id,
              nome: response.data[0].nome,
              descricao: response.data[0].descricao,
              estoque: response.data[0].estoque,
              preco_venda: response.data[0].preco_venda,
              preco_compra: response.data[0].preco_compra
            });
          }
        }
      }
    } catch (e) {

    }
  }

  const addProduto = async () => {
    try {
      if (produtoAdd.nome != '') {
        const response = await axios.post('http://localhost:8000/produto', {
          nome: produtoAdd.nome,
          descricao: produtoAdd.descricao,
          preco_venda: produtoAdd.preco_venda,
          preco_compra: produtoAdd.preco_compra,
          estoque: produtoAdd.estoque
        });
      
        if (response.status === 200) {
          await listaProdutos();
          alert('Produto Adicionado com Sucesso!');
        }
      }
    } catch (e) {

    }
  }

  const handleChange = (event) => {
    const { id } = event.target;
    setProdutoAdd({
      ...produtoAdd,
      [id]: event.target.value
    })
  }

  const deleteProdutos = async () => {
    if (selectedRows?.length > 0) {
      let isError = false;
      console.log('selected rows: ' + selectedRows)
      for (let i = 0; i < selectedRows.length; i++) {
        let idProduto = selectedRows[i];
        console.log('idProduto', idProduto)
        const response = await axios.delete('http://localhost:8000/produto', {
          data: { id: idProduto },
        });
        if (response.status != 200) {
          isError = true;
        }
      }

      setOpen(false);

      if (!isError) {
        alert('Produto(s) Deletado(s) com Sucesso!');
      }

      await listaProdutos();
    }
  }

  const handleOpen = () => {
    setOpen(true);
  }

  const handleClose = () => {
    setOpen(false);
  }

  const handleOpenDialog = async () => {
    if (selectedRows?.length == 1) {
      await getProduto(selectedRows[0]);
      setOpenDialog(true);
    }
  }

  const handleCloseDialog = () => {
    setOpenDialog(false);
  }


  return (
    <>
      <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', marginBottom: 3 }}>
        <img src='https://www.fiscalti.com.br/wp-content/uploads/2020/09/controle-de-estoque-para-mini-mercado.png' alt="banner" height="400px" width='100%' />
      </Box>
      <Box sx={{ paddingLeft: 3, paddingRight: 3, paddingBottom: 3 }}>
        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', marginBottom: 3 }}>
        <h1>Gestão Produtos</h1>
        </Box>
        <div style={{ border: '1px solid black', padding: 10, marginBottom: 50 }}>
          <Box sx={{ height: '100%', display: 'flex', justifyContent: 'center', marginBottom: 2 }}>
            <h3>Adicionar Produto</h3>
          </Box>
      <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between'}}>
        <TextField id="nome" value={produtoAdd.nome} onChange={handleChange} label="Nome" variant="outlined" />
        <TextField id="descricao" value={produtoAdd.descricao} onChange={handleChange} label="Descrição" variant="outlined" />
        <TextField id="preco_venda" value={produtoAdd.preco_venda} onChange={handleChange} type='number' label="Preço de Venda" variant="outlined" />
        <TextField id="preco_compra" value={produtoAdd.preco_compra} onChange={handleChange} type='number' label="Preço de Compra" variant="outlined" />
        <TextField id="estoque" value={produtoAdd.estoque} onChange={handleChange}  label="Estoque" type='number' variant="outlined" />
      </Box>
      <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: 3 }}>
        <Button variant="contained" onClick={addProduto}>Adicionar</Button>
          </Box>
        </div>
        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', marginBottom: 2 }}>
          <h1>Listagem de Produtos</h1>
      </Box>
      <Box sx={{ width: '100%', display: 'flex', justifyContent: 'end', marginBottom: 3}}>
        <Button variant="contained" sx={{marginRight: 3}} color='success' disabled={selectedRows?.length === 1 ? false : true} onClick={handleOpenDialog}>Visualizar</Button>
        <Button variant="contained" color='error' disabled={selectedRows?.length > 0 ? false : true} onClick={handleOpen}>Deletar</Button>
      </Box>
      <Box sx={{ width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 20,
              },
            },
          }}
          pageSizeOptions={[20]}
          checkboxSelection
          onRowSelectionModelChange={(newSelection) => {
            let array = []
            array = newSelection.map(item => item.toString());
            
            console.log(newSelection);
            setSelectedRows(newSelection);
          }}
        />
      </Box>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="child-modal-title"
        aria-describedby="child-modal-description"
      >
        <Box sx={{ ...style, width: 600 }}>
          <h2 id="child-modal-title">Deseja Remover o(s) Produto(s) Selecionado(s) ?</h2>
          <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
            <Button variant='contained' onClick={deleteProdutos} sx={{marginRight: '50px'}}>Sim</Button>
            <Button variant='contained' color='error' onClick={handleClose}>Não</Button>
          </Box>
        </Box>
      </Modal>
      <Dialog sx={{height: 400}} open={openDialog} onClose={handleCloseDialog}>
      <DialogTitle>Produto - {produtoView.nome}</DialogTitle>
        <DialogContent>
          <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}v>
            <TextField
              autoFocus
              margin="dense"
              id="nome-view"
              value={produtoView?.nome}
              label="Nome"
              variant="standard"
              disabled
            />
            <TextField
              autoFocus
              margin="dense"
              id="descricao-view"
              value={produtoView?.descricao}
              label="Descrição"
              variant="standard"
              disabled
            />
          </Box>
          <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
          <TextField
            autoFocus
            margin="dense"
            disabled
            id="descricao-view"
            value={produtoView?.preco_compra}
            label="Preço de Compra"
            variant="standard"
          />
          <TextField
            autoFocus
            margin="dense"
            disabled
            id="descricao-view"
            value={produtoView?.preco_venda}
            label="Preço de Venda"
            variant="standard"
            />
          </Box>
          <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
          <TextField
            autoFocus
            margin="dense"
            disabled
            id="descricao-view"
            value={produtoView?.estoque}
            label="Estoque"
            variant="standard"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button color='error' variant='contained' onClick={handleCloseDialog}>Fechar</Button>
        </DialogActions>
        </Dialog>
      </Box>
    </>
  );
}

export default App;
