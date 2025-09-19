import ABI from '../../abi.json';
import { ethers } from "ethers";
import { useState } from "react";

const CONTRACT_ADDRESS='0x96543E26C517Ad1d16E3238c92F63DC320F7ae27';
export default function Home() {
  const [bookIndex, setBookIndex] = useState("0");
  const [message, setMessage] = useState("");
  const [novoLivro, setNovoLivro] = useState({});

  function onBookChange(evt) {
    setNovoLivro(prevState => ({ ...prevState, [evt.target.id]: evt.target.value}));
  }

  async function btnSalvarClick() {
   // console.log('estou aqui');
   // alert(JSON.stringify(novoLivro));
   setMessage('Aceite a transação no METAMASK...')

   const provider = new ethers.BrowserProvider(window.ethereum);
   const signer = await provider.getSigner();
   const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
   const tx = await contract.addLivro(novoLivro.isbn, novoLivro.ano, novoLivro.preco, novoLivro.titulo, novoLivro.autor, novoLivro.paginas); 
   
   setMessage('Enviando um novo livro ao database...aguarde...');

   await tx.wait();

   setMessage("Tx: " + tx.hash);
  }

  async function btnLimpar() {
    document.getElementById('titulo').value="";
    document.getElementById('ano').value="";
    document.getElementById('isbn').value="";
    document.getElementById('preco').value="";
    document.getElementById('paginas').value="";
    document.getElementById('autor').value="";
  } 

  async function btnBuscarClick() {

    if (!window.ethereum) return setMessage('Metamask não encontrado!');
    const provider = new ethers.BrowserProvider(window.ethereum);
    const contas = await provider.send('eth_requestAccounts');
    if (!contas || !contas.length) return setMessage("Carteira não encontrada ou Carteira não permitida");
     
    //alert(bookIndex);

    try{
      const contract  = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);
      const livro = await contract.livros(bookIndex);
      alert(`Titulo: ${livro.titulo}, ISBN: ${livro.isbn}, Autor: ${livro.autor}, Ano: ${livro.ano}`);
    } catch (erro) {
      setMessage(erro);
    }
  }

  return (
    <>
    <div>
      <h3>Frontend DAPP - Livros Database</h3>
    </div>
    <div>
      <header>
         <p>
          <label>Book Index: <input type="number" value={bookIndex} onChange={evt=>setBookIndex(evt.target.value)}></input></label>
         </p>
         <p>
          <input type="button" value="Buscar" onClick={btnBuscarClick} />
         </p>
         <br />
         <h3>Cadastro Novo Livro</h3>
         <p>
          <label>Titulo: <input type="text" id="titulo" value={novoLivro.titulo} onChange={onBookChange}></input></label>
         </p>
         <p>
          <label>Autor: <input type="text" id="autor" value={novoLivro.autor} onChange={onBookChange}></input></label>
         </p>
         <p>
          <label>ISBN: <input type="text" id="isbn" value={novoLivro.isbn} onChange={onBookChange}></input></label>
         </p>
         <p>
          <label>Ano: <input type="text" id="ano" value={novoLivro.ano} onChange={onBookChange}></input></label>
         </p>
         <p>
          <label>Paginas: <input type="text" id="paginas" value={novoLivro.paginas} onChange={onBookChange}></input></label>
         </p>
          <p>
          <label>Preço: <input type="text" id="preco" value={novoLivro.preco} onChange={onBookChange}></input></label>
         </p>
         <br />
         <p><input type="button" value="Salvar" onClick={btnSalvarClick} />
         <input type="reset" value="Limpar" onClick={btnLimpar} /></p>
         <p>
          <br />
          {message}
         </p>
      </header>
    </div>
    </>
  );
}
