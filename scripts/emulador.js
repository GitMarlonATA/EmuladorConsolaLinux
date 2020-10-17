/*
 description Emulador de una terminal y varias máquinas en red usando Javascript
 author Julián Esteban Gutiérrez Posada y Carlos Eduardo Gomez Montoya
 email jugutier@uniquindio.edu.co carloseg@uniquindio.edu.co
 licence GNU General Public License  Ver. 4.0 (GNU GPL v4)
 date Septiembre 2020
 version 1.0
*/

/**
 * Borra (limpia) todo el contenido de la consola (ver HTML)
 */
function limpiarConsola() 
{
  document.getElementById( "textoImprimir" ).innerHTML = ""
  document.getElementById( "entrada" ).value           = "";
}

/**
 * Adiciona una texto a la consola de la GUI (Ver HTML)
 * @param texto Texto que se desea adicionar al final de la consola.
*/
function addConsola ( texto )
{
  document.getElementById( "textoImprimir" ).innerHTML += texto + "<br>" ;
  var consola = document.getElementById( "consola" );
  consola.scrollTop = consola.scrollHeight;
}


function procesarEntrada( e )
{
	if (e.keyCode == 13) {

		procesarComando ( document.getElementById( "entrada" ) );
	}
	
}

function procesarComando ( comando )
{
	var comandoParametros=  comando.value.replace(":"," ");
	    comandoParametros = comandoParametros.split(" ");

	if(document.getElementById( "prompt" ).innerHTML==="Login :")
	{
		comandoParametros = comando.value;
		procesarLogin(comandoParametros);
	}
	else
	{

		switch(comandoParametros[0]){
			case 'clear':
				procesarClear(comandoParametros);
				break;

			case 'logout':
				procesarLogout(comandoParametros);
				break;

			case 'touch':
				procesarTouch(comandoParametros,comando.value);
				break;

			case 'sudo':
				procesarSudo(comandoParametros,comando.value);
				break;
			
			default:
				addConsola(document.getElementById( "prompt" ).innerHTML + comando.value);
				addConsola("uqsh: comando no reconocido : "+ comando.value);
		}

	}

	addConsola ("");
	document.getElementById("entrada").value ="";

	
}

function procesarSudo(comandoParametros,comando){

	if(comandoParametros[1]=="chown"){

		let posarchivo = buscarArchivoPosicion(comandoParametros[4]);
		let posgrupo = buscarGrupo(comandoParametros[3]);
		let posusuario = buscarUsuario(comandoParametros[2]);

		console.log(posarchivo);
		console.log(posgrupo);
		console.log(posusuario);
		 
		if(posgrupo>=0 && posusuario>=0 && posarchivo>=0){
			sistema.maquina[sistema.maquinaActual].disco[0].archivo[posarchivo].grupo = posgrupo;
			sistema.maquina[sistema.maquinaActual].disco[0].archivo[posarchivo].duenio = posusuario;
			addConsola(document.getElementById( "prompt" ).innerHTML+ comando);
		}else{
			addConsola("error");
		}
		
	}


}

function buscarGrupo(nombreGrupo){

	let grupos = sistema.maquina[sistema.maquinaActual].grupo;



	for (let i = 0; i < grupos.length; i++) {

		console.log(grupos[i].nombre);

		if(nombreGrupo===grupos[i].nombre){
			return i;
		}
	}

	return -1;

}

function buscarUsuario(nombreUsuario){

	let usuarios = sistema.maquina[sistema.maquinaActual].usuario;

	for (let i = 0; i < usuarios.length; i++) {
		if(nombreUsuario===usuarios[i].nombre){
			return i;
		}
	}

	return -1;

}

function buscarArchivoPosicion(nombreArchivo){

	let maquinaActual = sistema.maquinaActual;
	let	archivos = sistema.maquina[maquinaActual].disco[0].archivo;
		
	for (let i = 0; i < archivos.length; i++) {
			if(nombreArchivo===archivos[i].nombre){
				return i
			}
		}
	return -1;

}


function procesarTouch(comandoParametros,comando){

	let nombreArchivo = comandoParametros[1];
	let archivo = buscarArchivo(nombreArchivo); 
	let usuarioActual = sistema.usuarioActual;
	let usuario = sistema.maquina[sistema.maquinaActual].usuario[usuarioActual];
	let comandoActual = document.getElementById( "prompt" ).innerHTML+ comando;
		if(archivo){
			if(archivo.duenio == usuarioActual){
				if(archivo.permiso.charAt(2)=='w')
				{
					addConsola(comandoActual);
				}
				else
				{
					addConsola(comandoActual);
					addConsola("el usuario no tiene el permiso para modificar el archivo");
				}
			}
			else
			{
				  if(usuario.grupo==archivo.grupo)
				  {
					if(archivo.permiso.charAt(5)=='w')
					{
						addConsola(comandoActual);
					}
					else
					{
						addConsola(comandoActual);
						addConsola("el usuario no tiene el permiso para modificar el archivo");
					}
				}
				else
				{
					if(archivo.permiso.charAt(8)=='w')
					{
						addConsola(comandoActual);
					}
					else
					{
						addConsola(comandoActual);
						addConsola("el usuario no tiene el permiso para modificar el archivo");
					}
				}
			}
		}
		else
		{
			let f = new Date();
			sistema.maquina[sistema.maquinaActual].disco[0].archivo.push( {"permiso":"-rw-r-----","duenio":usuarioActual,"grupo":usuario.grupo,"fecha":f.getFullYear()+"-"+f.getMonth() +1+"-"+f.getDate(),"nombre":nombreArchivo});
		}
}

function verificarPermisoEscritura(){


}

function buscarArchivo(nombreArchivo){

	let maquinaActual = sistema.maquinaActual;
	let	archivos = sistema.maquina[maquinaActual].disco[0].archivo;
		
	for (let i = 0; i < archivos.length; i++) {
			if(nombreArchivo===archivos[i].nombre){
				return archivos[i];
			}
		}
	return null;
}


function procesarLogout(comandoParametros){
	addConsola(document.getElementById( "prompt" ).innerHTML+ comandoParametros[0]);
	document.getElementById( "prompt" ).innerHTML = "Login :";
}


function procesarLogin(comandoParametros)
{
	let user = String(comandoParametros).trim();
	let nombreMaquina = verificarUsuarioEnSistema(user);

	if(nombreMaquina!=null)
	{
		addConsola("Login :"+ comandoParametros);
		document.getElementById( "prompt" ).innerHTML = ""+comandoParametros+"@"+nombreMaquina+"$";
	}
	else
	{
		addConsola("Login :"+ comandoParametros);
		addConsola("usuario no reconocido: "+ comandoParametros);
	}
}

function verificarUsuarioEnSistema(nombreUsuario){

	var maquinas = sistema.maquina;

		for (let i = 0; i < maquinas.length; i++) {
			let usuarios= maquinas[i].usuario;
			for (let j = 0; j < usuarios.length; j++) {
					let nombre = usuarios[j].nombre;
						if(nombre===nombreUsuario){
						actualizarUsiarioYMaquinaActual(i,j);
						return maquinas[i].nombre;
					}
				}
				
			}
	return null;
}

function actualizarUsiarioYMaquinaActual(i,j){
	sistema.usuarioActual=j;
	sistema.maquinaActual=i;
}

function procesarClear(comandoParametros){
	let system = sistema.maquina[0].nombre;
	console.log(system);

	if(comandoParametros.length >1){
		addConsola("clear: No requierie parámetros.");
	}else{
		limpiarConsola();
	}

}








