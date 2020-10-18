/*
 description Emulador de una terminal y varias máquinas en red usando Javascript
 author Anderson Ramirez Vasquez, Brayan Duque, Marlon Augusto Ticora Alvarez
 email maticoraa@uqvirtual.edu.co aramirezv_1@uqvirtual.edu.co
 licence GNU General Public License  Ver. 4.0 (GNU GPL v4)
 date Octibre 2020
 version 1.0
*/

var userSsh = -1;
var maquinaSsh = -1;

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

/**
 * Método que permite procesar el comando de entrada
 * @param {*} e Variable que representa el evento
 */
function procesarEntrada( e )
{
	if (e.keyCode == 13) {

		procesarComando ( document.getElementById( "entrada" ) );
	}
	
}

/**
 * Método que permite procesar el comando dependiendo de cuál sea
 * @param {*} comando comando a procesar
 */
function procesarComando ( comando )
{
	var comandoParametros =  comando.value.replace(":"," ");
		comandoParametros = comandoParametros.trim();
	    comandoParametros = comandoParametros.split(" ");

	if(document.getElementById( "prompt" ).innerHTML==="Login :")
	{
		comandoParametros = comando.value;
		procesarLogin(comandoParametros);
	}
	else
	{
		switch(comandoParametros[0])
		{
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
			case 'rm':
				procesarRm(comandoParametros,comando.value);
				break;
			case 'ssh':
				procesarSsh(comandoParametros,comando.value);
				break;
			case './':
				procesarEjecutar(comandoParametros,comando.value);
				break;
			case 'exit':
				procesarExit(comando.value);
				break;
			case 'scp':
				procesarScp(comandoParametros, comando.value);
				break;
			default:
				addConsola(document.getElementById( "prompt" ).innerHTML + comando.value);
				addConsola("bash: "+ comando.value + " : comand not found");
		}

	}
	addConsola ("");
	document.getElementById("entrada").value ="";
}

/**
 * Método que permite simular el funcionamiento del comando SCP
 * @param {*} comandoParametro variable que representa los parametros del comando
 * @param {*} comando variable que representa el comando
 */
function procesarScp(comandoParametro,comando)
{
	let ip = "";
	let usuario = "";
	let archivoO = "";
	let archivoD = "";

	if(comandoParametro[1].includes("@"))
	{
		let valoresParametros = comandoParametro[1].split("@");
		usuario = valoresParametros[0];
		let valoresParam2 = valoresParametros[1].split(":");
		ip = valoresParam2[0];
		archivoO = valoresParam2[1];
		archivoD = comandoParametro[2];
	}
	else if(comandoParametro[2].includes("@"))
	{
		archivoO = comandoParametro[1];
		let valoresParametros = comandoParametro[2].split("@");
		usuario = valoresParametros[0];
		let valoresParam2 = valoresParametros[2].split(":");
		ip = valoresParam2[0];
		archivoD = valoresParam2[1];
	}
	else
	{
		addConsola(document.getElementById( "prompt" ).innerHTML + comando);
		addConsola("bash: "+ comando + " : comand not found");
	}

	if(archivoD !== "" && archivoO !== "" && ip !== "" && usuario !== "")
	{
		let validacion = validarIpUser(ip,usuario,comando);
		if(validacion.length>0)
		{
			let results = validacion.split(";");
			sistema.maquina[results[0]].disco[0].archivo.push(archivoO);
			console.log(sistema);
		}
	}
}

/**
 * Método que permite simular el funcionamiento del comando EXIT cuando se usa SSH antes
 * @param {*} comando variable que representa el comando
 */
function procesarExit(comando)
{
	if(maquinaSsh!==-1 && userSsh !== -1)
	{
		console.log("entra exit");
		let comandoActual = document.getElementById( "prompt" ).innerHTML+ comando;

		sistema.maquinaActual = maquinaSsh;
		sistema.usuarioActual = userSsh;

		let user = sistema.maquina[maquinaSsh].usuario[userSsh].nombre;
		let nombreMaquina = verificarUsuarioEnSistema(user);

		addConsola(comandoActual);
		document.getElementById( "prompt" ).innerHTML = ""+user+"@"+nombreMaquina+"~$ ";
		maquinaSsh = -1;
		userSsh = -1;
	}
	else
	{
		addConsola(comando);
		addConsola(" no se puede resolver exit ");
	}
	
}

/**
 * Método que permite simular el funcionamiento del comando SSH
 * @param {*} comandoParametro variable que representa los parametros del comando
 * @param {*} comando variable que representa el comando
 */
function procesarSsh(comandoParametro,comando)
{
	let params = comandoParametro[1].split("@");
	let user = params[0];
	let ip = params[1];
	let comandoActual = document.getElementById( "prompt" ).innerHTML+ comando;

	maquinaSsh = sistema.maquinaActual;
	userSsh = sistema.usuarioActual;
	let validacion = validarIpUser(ip,user,comando);
	let nombreMaquina = verificarUsuarioEnSistema(user);

	if(validacion.length>0)
	{	
		addConsola(comandoActual);
		document.getElementById( "prompt" ).innerHTML = ""+user+"@"+nombreMaquina+"~$ ";
	}
}

/**
 * Método que permite validar la existencia de una IP sobre el sistema y del usuario sobre la máquina de esa IP
 * @param {*} ip ip de la máquina del sistema
 * @param {*} user usuario sobre la máquina
 * @param {*} comando variable que representa el comando
 */
function validarIpUser(ip,user,comando)
{
	let maquinas = sistema.maquina;
	let userValid = false;
	let ipValid = false;
	let indiceMaquina = 0;
	let indiceUsuario = 0;
	let comandoActual = document.getElementById( "prompt" ).innerHTML+ comando;

	for(let i = 0; i < maquinas.length; i++)
	{
		if(maquinas[i].ip===ip)
		{
			ipValid = true;
			let usuarios = maquinas[i].usuario;
			indiceMaquina = i;

			for(let j = 0 ; j < usuarios.length; j++)
			{
				if(usuarios[j].nombre===user)
				{
					userValid = true;
					indiceUsuario = j;
				}
			}
		}
	}

	
	if(userValid===true && ipValid===true)
	{
		actualizarUsiarioYMaquinaActual(indiceMaquina,indiceUsuario);
		return indiceMaquina + ";" + indiceUsuario;
	}
	else if(ipValid===false)
	{
		addConsola(comandoActual);
		addConsola("ssh: no se puede resolver el nombre " + ip);
	}
	else
	{
		return "";
	}
}

/**
 * Método que permite simular el funcionamiento del comando CAT
 * @param {*} comandoParametro variable que representa los parametros del comando
 * @param {*} comando variable que representa el comando
 */
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
			addConsola("Permision denied");
		}
	}
	else
	{
		addConsola(comandoActual);
		addConsola("cat: " + archivo.nombre + " : No such file or directory");
	}
}

/**
 * Método que permite simular el funcionamiento del comando ./ ejecutar
 * @param {*} comandoParametro variable que representa los parametros del comando
 * @param {*} comando variable que representa el comando
 */
function procesarEjecutar(comandoParametro,comando)
{
	let usuarioActual = sistema.usuarioActual;
	let usuario = sistema.maquina[sistema.maquinaActual].usuario[usuarioActual];
	let archivo = buscarArchivo(comandoParametro[1]);
	let comandoActual = document.getElementById( "prompt" ).innerHTML+ comando;
	if(archivo!==null)
	{
		addConsola(comandoActual);

		if(verificarPermisoEjecucion(archivo,comandoActual,usuario,usuarioActual))
		{
			addConsola("Ejecutando en el archivo...");
		}
		else
		{
			addConsola("Permision denied");
		}
	}
	else
	{
		addConsola(comandoActual);
		addConsola("./: " + comandoParametro[1] + " : No such file or directory");
	}
}

/**
 * Método que permite simular el funcionamiento del comando RM
 * @param {*} comandoParametro variable que representa los parametros del comando
 * @param {*} comando variable que representa el comando
 */
function procesarRm(comandoParametro,comando)
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
			let posarchivo = buscarArchivoPosicion(comandoParametro[1]);
			console.log(posarchivo);
			console.log(sistema.maquina[sistema.maquinaActual].disco[0].archivo);
			sistema.maquina[sistema.maquinaActual].disco[0].archivo.splice(posarchivo,1);
			console.log(sistema.maquina[sistema.maquinaActual].disco[0].archivo);
			console.log(sistema);
		}
		else
		{
			addConsola("Permision denied");
		}
	}
	else
	{
		addConsola(comandoActual);
		addConsola("rm: " + comandoParametro[1] + " : No such file or directory");
	}
}

/**
 * Método que permite simular el funcionamiento del comando NANO
 * @param {*} comandoParametro variable que representa los parametros del comando
 * @param {*} comando variable que representa el comando
 */
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
			addConsola("Permision denied");
		}
	}
}

/**
 * Método que permite simular el funcionamiento del comando LS
 * @param {*} comandoParametro variable que representa los parametros del comando
 * @param {*} comando variable que representa el comando
 */
function procesarLs(comandoParametro, comando)
{
	let	archivos = sistema.maquina[sistema.maquinaActual].disco[0].archivo;
	let comandoActual = document.getElementById( "prompt" ).innerHTML+ comando;
	addConsola(comandoActual);
	if(comandoParametro.length>1)
	{
		if(comandoParametro[1]==="-l")
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
			addConsola("bash: "+ comando + " : comand not found");
		}
	}
	else
	{
		for( let i = 0; i < archivos.length ; i++)
		{
			addConsola(archivos[i].nombre);
		}
	}

}

/**
 * Método que permite simular el funcionamiento del comando CHMOD
 * @param {*} comandoParametro variable que representa los parametros del comando
 * @param {*} comando variable que representa el comando
 */
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
				addConsola("Permision denied");
			}
		}
		else
		{
			addConsola(comandoActual);
			addConsola("chmod: invalid mode: '" + comandoParametros[1] + "'");
		}
	}
	else
	{
		addConsola(comandoActual);
		addConsola("chmod: cannot access '" + archivo.nombre + "' : No such file or directory");
	}
}

/**
 * Método que permite simular el funcionamiento del comando SUDO CHOWN
 * @param {*} comandoParametro variable que representa los parametros del comando
 * @param {*} comando variable que representa el comando
 */
function procesarSudo(comandoParametros,comando)
{

	if(comandoParametros[1]=="chown"){

		let posarchivo = buscarArchivoPosicion(comandoParametros[4]);
		let posgrupo = buscarGrupo(comandoParametros[3]);
		let posusuario = buscarUsuario(comandoParametros[2]);

		console.log(posarchivo);
		console.log(posgrupo);
		console.log(posusuario);
		 
		if(posgrupo>=0 && posusuario>=0 && posarchivo>=0)
		{
			sistema.maquina[sistema.maquinaActual].disco[0].archivo[posarchivo].grupo = posgrupo;
			sistema.maquina[sistema.maquinaActual].disco[0].archivo[posarchivo].duenio = posusuario;
			addConsola(document.getElementById( "prompt" ).innerHTML+ comando);
		}
		else
		{
			addConsola("error");
		}
		
	}


}

/**
 * Método que permite buscar un grupo
 * @param {*} nombreGrupo variable que representa el grupo
 */
function buscarGrupo(nombreGrupo)
{

	let grupos = sistema.maquina[sistema.maquinaActual].grupo;



	for (let i = 0; i < grupos.length; i++) 
	{

		console.log(grupos[i].nombre);

		if(nombreGrupo===grupos[i].nombre){
			return i;
		}
	}

	return -1;

}

/**
 * Método que permite buscar un usuario sobre la máquina actual
 * @param {*} nombreUsuario nombre del usuario
 */
function buscarUsuario(nombreUsuario){

	let usuarios = sistema.maquina[sistema.maquinaActual].usuario;

	for (let i = 0; i < usuarios.length; i++) {
		if(nombreUsuario===usuarios[i].nombre){
			return i;
		}
	}

	return -1;

}

/**
 * Método que permite buscar la posición de un archivo sobre la máquina
 * @param {*} nombreArchivo nombre del archivo
 */
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

/**
 * Método que permite simular el funcionamiento del comando TOUCH
 * @param {*} comandoParametro variable que representa los parametros del comando
 * @param {*} comando variable que representa el comando
 */
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

/**
 * Método que permite verificar si un usuario tiene permisos de escritura sobre un archivo
 * @param {*} archivo variable que representa el archivo a buscar
 * @param {*} comandoActual variable que representa el comando ingresado
 * @param {*} usuario variable que representa el usuario que requiere acceso
 * @param {*} usuarioActual variable que representa el usuario actual en la máquina
 */
function verificarPermisoEscritura(archivo,comandoActual,usuario,usuarioActual)
{
	console.log("Archivo");
	console.log(archivo);
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

/**
 * Método que permite verificar si un usuario tiene permisos de ejecución sobre un archivo
 * @param {*} archivo variable que representa el archivo a buscar
 * @param {*} comandoActual variable que representa el comando ingresado
 * @param {*} usuario variable que representa el usuario que requiere acceso
 * @param {*} usuarioActual variable que representa el usuario actual en la máquina
 */
function verificarPermisoEjecucion(archivo,comandoActual,usuario,usuarioActual)
{
	if(archivo.duenio == usuarioActual)
	{
		if(archivo.permiso.charAt(3)==='x')
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
			if(archivo.permiso.charAt(6)==='x')
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
			if(archivo.permiso.charAt(9)==='x')
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

/**
 * Método que permite verificar si un usuario tiene permisos de lectura sobre un archivo
 * @param {*} archivo variable que representa el archivo a buscar
 * @param {*} comandoActual variable que representa el comando ingresado
 * @param {*} usuario variable que representa el usuario que requiere acceso
 * @param {*} usuarioActual variable que representa el usuario actual en la máquina
 */
function verificarPermisoLectura(archivo,comandoActual,usuario,usuarioActual)
{
	if(archivo.duenio == usuarioActual)
	{
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

/**
 * Método que permite buscar un archivo sobre la máquina
 * @param {*} nombreArchivo variable que representa el nombre del archivo
 */
function buscarArchivo(nombreArchivo)
{

	let maquinaActual = sistema.maquinaActual;
	let	archivos = sistema.maquina[maquinaActual].disco[0].archivo;
		
	for (let i = 0; i < archivos.length; i++) {
			if(nombreArchivo===archivos[i].nombre){
				return archivos[i];
			}
		}
	return null;
}

/**
 * Método que permite simular el funcionamiento del comando LOGOUT
 * @param {*} comandoParametro variable que representa los parametros del comando
 */
function procesarLogout(comandoParametros){
	addConsola(document.getElementById( "prompt" ).innerHTML+ comandoParametros[0]);
	document.getElementById( "prompt" ).innerHTML = "Login :";
}

/**
 * Método que permite simular el funcionamiento del comando LOGIN
 * @param {*} comandoParametro variable que representa los parametros del comando
 */
function procesarLogin(comandoParametros)
{
	let user = String(comandoParametros).trim();
	let nombreMaquina = verificarUsuarioEnSistema(user);

	if(nombreMaquina!=null)
	{
		addConsola("Login :"+ comandoParametros);
		document.getElementById( "prompt" ).innerHTML = ""+comandoParametros+"@"+nombreMaquina+"~$ ";
	}
	else
	{
		addConsola("Login :"+ comandoParametros);
		addConsola("usuario no reconocido: "+ comandoParametros);
	}
}

/**
 * Método que permite verificar la existencia de un usuario sobre el sistema
 * @param {*} nombreUsuario variable que representa el nombre del usuario
 */
function verificarUsuarioEnSistema(nombreUsuario)
{

	var maquinas = sistema.maquina;

		for (let i = 0; i < maquinas.length; i++) 
		{
			let usuarios= maquinas[i].usuario;

			for (let j = 0; j < usuarios.length; j++) 
			{
					let nombre = usuarios[j].nombre;

					if(nombre===nombreUsuario)
					{
						actualizarUsiarioYMaquinaActual(i,j);
						return maquinas[i].nombre;
					}
				}
				
			}
	return null;
}

/**
 * Método que permite actualizar el usuario actual y la máquina actual del sistema
 * @param {*} i posición de la máquina actual
 * @param {*} j posición del usuario actual
 */
function actualizarUsiarioYMaquinaActual(i,j)
{
	sistema.usuarioActual=j;
	sistema.maquinaActual=i;
}

/**
 * Método que permite simular el funcionamiento del comando CLEAR
 * @param {*} comandoParametro variable que representa los parametros del comando
 */
function procesarClear(comandoParametros)
{
	let system = sistema.maquina[0].nombre;
	console.log(system);

	if(comandoParametros.length >1){
		addConsola("clear: No requiere parámetros.");
	}else{
		limpiarConsola();
	}

}

/**
 * Método que permite definir los permisos del usuario
 * @param {*} permisos números que representan los permisos
 */
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

/**
 * Método que define los permisos del usuario
 * @param {*} permiso variable que representa el permiso del usuario
 */
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








