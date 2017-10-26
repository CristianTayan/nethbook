<?php 

namespace App\libs;
/* ------------------------------------------------------------ Include lib ----------------------------------------------------*/
	
	//require_once('nusoap/lib/nusoap.php');
include_once('simple_html_dom.php');

/* --------------------------------------- Instancias, consumir sri usando curt modo desarrollo --------------------------------*/
	class DatosMovil {

		var $user_agent = array();
		var $url;
		var $proxy;
		function __construct() {
			// $this->url = "https://app03.cne.gob.ec/domicilioelectoral/Default.aspx";					
			$user_agent[] = "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; .NET CLR 1.1.4322; FDM)";
			$user_agent[] = "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.0; Avant Browser [avantbrowser.com]; Hotbar 4.4.5.0)";
			$user_agent[] = "Mozilla/5.0 (Macintosh; U; Intel Mac OS X; en; rv:1.8.1.14) Gecko/20080409 Camino/1.6 (like Firefox/2.0.0.14)";
			$user_agent[] = "Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US) AppleWebKit/525.13 (KHTML, like Gecko) Version/3.1 Safari/525.13";
			$user_agent[] = "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1; NeosBrowser; .NET CLR 1.1.4322; .NET CLR 2.0.50727)";
			$user_agent[] = "Mozilla/5.0 (Windows; U; Windows NT 5.1; es-ES; rv:1.8.1) Gecko/20061010 Firefox/2.0";
			$this->user_agent = $user_agent;
		}
		
		/* ------------------------------------ verificar actecedente --------------------*/
		function verificar_existencia_movil($valor){
			$proxies = array(); // Declaring an array to store the proxy list
 
			// // Adding list of proxies to the $proxies array
			// $proxies[] = '195.58.245.70:3120';  // Some proxies require user, password, IP and port number
			// // $proxies[] = '200.54.180.226:80';
			// // $proxies[] = '168.102.134.47:8080';
			// // $proxies[] = '185.80.130.70:3128';  // Some proxies only require IP
			// // $proxies[] = '52.37.109.168:8083';
			// // $proxies[] = '112.137.164.232:3128'; // Some proxies require IP and port number
			// // $proxies[] = '111.1.23.148:80';

			// // Choose a random proxy
			// if (isset($proxies)) {  // If the $proxies array contains items, then
			//     $proxy = $proxies[array_rand($proxies)];    // Select a random proxy from the array and assign to $proxy variable
			//     // echo $proxy;
			// }
			
			// $valor = '0959999350';
			if (strlen($valor)==10) {
			$movil = substr($valor,1,strlen($valor));
			}else 
			$movil = $valor;

			$url="https://lookup.ascp.com.ec/lookup.html"; 
			$postinfo = "lang=8&id=&ism=-&telno=".$movil."";
			$cookie_file_path = "cookie.txt";
			$ch = curl_init();
			// curl_setopt($ch, CURLOPT_PROXY, $proxy);    // Set CURLOPT_PROXY with proxy in $proxy variable
			curl_setopt($ch, CURLOPT_HEADER, false);
			curl_setopt($ch, CURLOPT_NOBODY, false);
			curl_setopt($ch, CURLOPT_URL, $url);
			curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);

			curl_setopt($ch, CURLOPT_COOKIEJAR, $cookie_file_path);
			//set the cookie the site has for certain features, this is optional
			curl_setopt($ch, CURLOPT_USERAGENT,"");
			curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
			curl_setopt($ch, CURLOPT_REFERER, $_SERVER['REQUEST_URI']);
			curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);
			curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 0);

			curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
			curl_setopt($ch, CURLOPT_POST, 1);
			curl_setopt($ch, CURLOPT_POSTFIELDS, $postinfo);
			curl_exec($ch);

			// curl_setopt($ch, CURLOPT_URL, "https://lookup.ascp.com.ec/lookup.html?lang=8&id=&ism=-&telno=959999350");

			$html = curl_exec($ch);
			curl_close($ch);
			// echo $html;
			 $html=str_get_html($html);
			// $htmlreturn = $html->find('table[id=dlDirElec]', 0);
			$i=0;
			$results=array();
			// echo $html->find('div[class=res] span', 1);
			if ((string)$html->find('div[class=res] span', 1)!="") {
				$auxoperadora=explode(':', $html->find('div[class=res] span', 1)->plaintext);
				$auxmovil=explode(':', $html->find('div[class=res] span', 0)->plaintext);
				$results['operadora']=$auxoperadora[1];
				$results['nro']=$auxmovil[1];
				$results['status']=200;
			}
			else{
				$results['status']=401;
			}
			return $results;
	}
}
