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
		console.log(comandoParametros[0]);
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
			case 'chmod':
				procesarChmod(comandoParametros,comando.value);
				break;
			case 'ls':
				procesarLs(comandoParametros,comando.value);
				break;
			case 'cat':
				procesarCat(comandoParametros,comando.value);
				break;
			case 'nanoo':
				procesarNano(comandoParametros,comando.value);
				break;
			default:
				addConsola(document.getElementById( "prompt" ).innerHTML + comando.value);
				addConsola("uqsh: comando no reconocido : "+ comando.value);
		}

	}

	addConsola ("");
	document.getElementById("entrada").value ="";

	
}

function procesarCat(comandoParametro,comando)
{
	let usuarioActual = sistema.usuarioActual;
	let usuario = sistema.maquina[sistema.maquinaActual].usuario[usuarioActual];
	let archivo = buscarArchivo(comandoParametro[1]);
	let comandoActual = document.getElementById( "prompt" ).innerHTML+ comando;
	if(archivo!==null)
	{
		addConsola(comandoActual);

		if(verificarPermisoLectura(archivo,comandoActual,usuario,usuarioActual))
		{
			addConsola("Leyendo el contenido del archivo...");
		}
		else
		{
			addConsola("El usuario no tiene permisos");
		}
	}
	else
	{
		addConsola(comandoActual);
		addConsola("El archivo no existe");
	}
}

function procesarNano(comandoParametro,comando)
{
	let usuarioActual = sistema.usuarioActual;
	let usuario = sistema.maquina[sistema.maquinaActual].usuario[usuarioActual];
	let archivo = buscarArchivo(comandoParametro[1]);
	let comandoActual = document.getElementById( "prompt" ).innerHTML+ comando;
	if(archivo!==null)
	{
		addConsola(comandoActual);

		if(verificarPermisoEscritura(archivo,comandoActual,usuario,usuarioActual))
		{
			addConsola("Escribiendo en el archivo...");
		}
		else
		{
			addConsola("El usuario no tiene permisos");
		}
	}
	else
	{
		addConsola("El archivo no existe");
	}
}

function procesarLs(comandoParamanetro, comando)
{
	let	archivos = sistema.maquina[sistema.maquinaActual].disco[0].archivo;
	let comandoActual = document.getElementById( "prompt" ).innerHTML+ comando;
	addConsola(comandoActual);
	if(comandoParamanetro.length>1)
	{
		if(comandoParamanetro[1]==="-l")
		{
			addConsola("Permisos | Duenio | Grupo | Fecha | Nombre archivo");
			for( let i = 0; i < archivos.length ; i++)
			{
				
				addConsola(archivos[i].permiso + " | " + 
				archivos[i].duenio + " | " + archivos[i].grupo 
				+ " | " + archivos[i].fecha + " | " + archivos[i].nombre);
			}
		}
		else
		{
			addConsola("error");
		}
	}
	else
	{
		addConsola("Nombre archivo");
		for( let i = 0; i < archivos.length ; i++)
		{
			addConsola(archivos[i].nombre);
		}
	}

}

function procesarChmod(comandoParametros,comando)
{
	let usuarioActual = sistema.usuarioActual;
	let usuario = sistema.maquina[sistema.maquinaActual].usuario[usuarioActual];
	let archivo = buscarArchivo(comandoParametros[2]);
	let comandoActual = document.getElementById( "prompt" ).innerHTML+ comando;
	if(archivo!==null)
	{
		if(parseInt(comandoParametros[1]) <= 777)
		{
			console.log(verificarPermisoEscritura(archivo,comandoActual,usuario,usuarioActual));
			if(verificarPermisoEscritura(archivo,comandoActual,usuario,usuarioActual))
			{
				let permisos = definirPermisosChmod(comandoParametros[1]);
				let posarchivo = buscarArchivoPosicion(comandoParametros[2]);
				sistema.maquina[sistema.maquinaActual].disco[0].archivo[posarchivo].permiso = permisos;
				addConsola(comandoActual);
				console.log(sistema);
			}
			else
			{
				addConsola(comandoActual);
				addConsola("Error Permisos Escritura");
			}
		}
		else
		{
			addConsola(comandoActual);
			addConsola("Error comando permisos");
		}
	}
	else
	{
		addConsola(comandoActual);
		addConsola("El archivo no existe");
	}
}

function procesarSudo(comandoParametros,comando)
{

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

function buscarArchivoPosicion(nombreArchivo)
{
	let	archivos = sistema.maquina[sistema.maquinaActual].disco[0].archivo;
		
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

	if(archivo!==null)
	{
		if(verificarPermisoEscritura(archivo,comandoActual,usuario,usuarioActual))
		{
			addConsola(comandoActual);
			addConsola("MODIFICANDO ARCHIVO");
		}
	}
	else
	{
		let f = new Date();
		sistema.maquina[sistema.maquinaActual].disco[0].archivo.push( {"permiso":"-rw-r-----","duenio":usuarioActual,"grupo":usuario.grupo,"fecha":f.getFullYear()+"-"+f.getMonth() +1+"-"+f.getDate(),"nombre":nombreArchivo});
	}
}

function verificarPermisoEscritura(archivo,comandoActual,usuario,usuarioActual)
{
	if(archivo.duenio == usuarioActual)
	{
		if(archivo.permiso.charAt(2)==='w')
		{
			return true;
		}
		else
		{
			return false;
		}
	}
	else
	{
		  if(usuario.grupo==archivo.grupo)
		  {
			if(archivo.permiso.charAt(5)==='w')
			{
				return true;
			}
			else
			{
				return false;
			}
		}
		else
		{
			if(archivo.permiso.charAt(8)==='w')
			{
				return true;
			}
			else
			{
				return false;
			}
		}
	}

}

function verificarPermisoLectura(archivo,comandoActual,usuario,usuarioActual)
{
	if(archivo.duenio == usuarioActual){
		if(archivo.permiso.charAt(1)=='r')
		{
			return true;
		}
		else
		{
			return false;
		}
	}
	else
	{
		  if(usuario.grupo==archivo.grupo)
		  {
			if(archivo.permiso.charAt(4)=='r')
			{
				return true;
			}
			else
			{
				return false;
			}
		}
		else
		{
			if(archivo.permiso.charAt(7)=='r')
			{
				return true;
			}
			else
			{
				return false;
			}
		}
	}

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

function definirPermisosChmod(permisos)
{
	let resultadoPermisos = "-";
	let longitudPermisos = permisos.length;

	for (let i = 0; i < longitudPermisos; i++)
	{
		let permiso = permisos.charAt(i);
		permiso = parseInt(permiso);
		resultadoPermisos += definirPermiso(permiso);
	}

	return resultadoPermisos;

}

function definirPermiso(permiso)
{
	let resultadoPermiso = "";

	switch (permiso)
	{
		case 0: resultadoPermiso = "---"; break;
		case 1: resultadoPermiso = "--x"; break;
		case 2: resultadoPermiso = "-w-"; break;
		case 3: resultadoPermiso = "-wx"; break;
		case 4: resultadoPermiso = "r--"; break;
		case 5: resultadoPermiso = "r-x"; break;
		case 6: resultadoPermiso = "rw-"; break;
		case 7: resultadoPermiso = "rwx"; break;
	}

	return resultadoPermiso;
}








