import ABI from '../../abi.json';
import { ethers } from "ethers";
import { useState } from "react";

const CONTRACT_ADDRESS='0x96543E26C517Ad1d16E3238c92F63DC320F7ae27';
export default function Home() {
  const [bookIndex, setBookIndex] = useState("0");
  const [message, setMessage] = useState("");

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
         <p>
          <br />
          {message}
         </p>
      </header>
    </div>
    </>
  );
}
