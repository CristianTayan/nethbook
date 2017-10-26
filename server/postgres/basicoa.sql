--
-- PostgreSQL database dump
--

-- Dumped from database version 9.2.20
-- Dumped by pg_dump version 9.2.20
-- Started on 2017-10-24 09:57:30

SET statement_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;

--
-- TOC entry 7 (class 2615 OID 48131)
-- Name: administracion; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA administracion;


--
-- TOC entry 8 (class 2615 OID 48132)
-- Name: auditoria; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA auditoria;


--
-- TOC entry 3001 (class 0 OID 0)
-- Dependencies: 8
-- Name: SCHEMA auditoria; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON SCHEMA auditoria IS 'auditoria de los cambios en la bd';


--
-- TOC entry 9 (class 2615 OID 48133)
-- Name: contabilidad; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA contabilidad;


--
-- TOC entry 10 (class 2615 OID 48134)
-- Name: inventario; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA inventario;


--
-- TOC entry 11 (class 2615 OID 48135)
-- Name: talento_humano; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA talento_humano;


--
-- TOC entry 12 (class 2615 OID 48136)
-- Name: usuarios; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA usuarios;


--
-- TOC entry 13 (class 2615 OID 48137)
-- Name: ventas; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA ventas;


--
-- TOC entry 1 (class 3079 OID 11727)
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- TOC entry 3003 (class 0 OID 0)
-- Dependencies: 1
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET search_path = public, pg_catalog;

--
-- TOC entry 334 (class 1255 OID 48138)
-- Name: f_convnl(numeric); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION f_convnl(num numeric) RETURNS character varying
    LANGUAGE plpgsql
    AS $$
-- Función que devuelve la cadena de texto en castellano que corresponde a un número.
-- Parámetros: número con 2 decimales, máximo 999.999.999,99.

DECLARE	
	d varchar[];
	f varchar[];
	g varchar[];
	numt varchar;
	txt varchar;
	a integer;
	a1 integer;
	a2 integer;
	n integer;
	p integer;
	negativo boolean;
BEGIN
	-- Máximo 999.999.999,99
	if num > 999999999.99 then
		return '---';
	end if;
	txt = '';
	d = array[' un',' dos',' tres',' cuatro',' cinco',' seis',' siete',' ocho',' nueve',' diez',' once',' doce',' trece',' catorce',' quince',
		' dieciseis',' diecisiete',' dieciocho',' diecinueve',' veinte',' veintiun',' veintidos', ' veintitres', ' veinticuatro', ' veinticinco',
		' veintiseis',' veintisiete',' veintiocho',' veintinueve'];
	f = array ['','',' treinta',' cuarenta',' cincuenta',' sesenta',' setenta',' ochenta', ' noventa'];
	g= array [' ciento',' doscientos',' trescientos',' cuatrocientos',' quinientos',' seiscientos',' setecientos',' ochocientos',' novecientos'];
	numt = lpad((num::numeric(12,2))::text,12,'0');
	if strpos(numt,'-') > 0 then
	   negativo = true;
	else
	   negativo = false;
	end if;
	numt = translate(numt,'-','0');
	numt = translate(numt,'.,','');
	-- Trato 4 grupos: millones, miles, unidades y decimales
	p = 1;
	for i in 1..4 loop
		if i < 4 then
			n = substring(numt::text from p for 3);
		else
			n = substring(numt::text from p for 2);
		end if;
		p = p + 3;
		if i = 4 then
			if txt = '' then
				txt = ' cero';
			end if;
			if n > 0 then
			-- Empieza con los decimales
				txt = txt || ' con';
			end if;
		end if;
		-- Centenas 
		if n > 99 then
			a = substring(n::text from 1 for 1);
			a1 = substring(n::text from 2 for 2);
			if a = 1 then
				if a1 = 0 then
					txt = txt || ' cien';
				else
					txt = txt || ' ciento';
				end if;
			else
				txt = txt || g[a];
			end if;
		else
			a1 = n;
		end if;
		-- Decenas
		a = a1;
		if a > 0 then
			if a < 30 then
				if a = 21 and (i = 3 or i = 4) then
					txt = txt || ' veintiuno';
				elsif n = 1 and i = 2 then
					txt = txt; 
				elsif a = 1 and (i = 3 or i = 4)then
					txt = txt || ' uno';
				else
					txt = txt || d[a];
				end if;
			else
				a1 = substring(a::text from 1 for 1);
				a2 = substring(a::text from 2 for 1);
				if a2 = 1 and (i = 3 or i = 4) then
						txt = txt || f[a1] || ' y' || ' uno';
				else
					if a2 <> 0 then
						txt = txt || f[a1] || ' y' || d[a2];
					else
						txt = txt || f[a1];
					end if;
				end if;
			end if;
		end if;
		if n > 0 then
			if i = 1 then
				if n = 1 then
					txt = txt || ' millón';
				else
					txt = txt || ' millones';
				end if;
			elsif i = 2 then
				txt = txt || ' mil';
			end if;		
		end if;
	end loop;
	txt = ltrim(txt);
	if negativo = true then
	   txt= '-' || txt;
	end if;
    RETURN txt;
END;
$$;


--
-- TOC entry 335 (class 1255 OID 48139)
-- Name: fun_auditoria(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION fun_auditoria() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF (TG_OP = 'DELETE') THEN
    INSERT INTO auditoria.auditoria ("tabla_afectada", "operacion", "variable_anterior", "variable_nueva", "fecha", "usuario")
           VALUES (TG_TABLE_NAME, 'D', OLD, NULL, now(), USER);
    RETURN OLD;
  ELSIF (TG_OP = 'UPDATE') THEN
    INSERT INTO auditoria.auditoria ("tabla_afectada", "operacion", "variable_anterior", "variable_nueva", "fecha", "usuario")
           VALUES (TG_TABLE_NAME, 'U', OLD, NEW, now(), USER);
    RETURN NEW;
  ELSIF (TG_OP = 'INSERT') THEN
    INSERT INTO auditoria.auditoria ("tabla_afectada", "operacion", "variable_anterior", "variable_nueva", "fecha", "usuario")
           VALUES (TG_TABLE_NAME, 'I', NULL, NEW, now(), USER);
    RETURN NEW;
  END IF;
  RETURN NULL;
END;
$$;


--
-- TOC entry 336 (class 1255 OID 48140)
-- Name: fun_cliente_empresa(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION fun_cliente_empresa() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF (TG_OP = 'DELETE') THEN
    UPDATE administracion.clientes
		SET estado= 'I'
		WHERE id = new.id;
    RETURN OLD;
  ELSIF (TG_OP = 'UPDATE') THEN
	UPDATE administracion.clientes
		SET estado= 'I'
		WHERE id = new.id;
    RETURN NEW;
  ELSIF (TG_OP = 'INSERT') THEN
    INSERT INTO administracion.clientes ("id", "tipo_cliente", "id_cliente", "id_tipo_documento", "fecha","estado")
           VALUES (new.ruc_ci, 2, new.id, NEW.tipo_empresa, now(),'A' );
    RETURN NEW;
  END IF;
  RETURN NULL;
END;
$$;


--
-- TOC entry 337 (class 1255 OID 48141)
-- Name: fun_cliente_persona(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION fun_cliente_persona() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF (TG_OP = 'DELETE') THEN
    UPDATE administracion.clientes
		SET estado= 'I'
		WHERE id = new.id;
    RETURN OLD;
  ELSIF (TG_OP = 'UPDATE') THEN
	UPDATE administracion.clientes
		SET estado= 'I'
		WHERE id = new.id;
    RETURN NEW;
  ELSIF (TG_OP = 'INSERT') THEN
    INSERT INTO administracion.clientes ("id", "tipo_cliente", "id_cliente", "id_tipo_documento", "fecha","estado")
           VALUES (new.numero_identificacion, 1, new.id_persona, NEW.id_tipo_documento, now(),'A' );
    RETURN NEW;
  END IF;
  RETURN NULL;
END;
$$;


SET search_path = usuarios, pg_catalog;

--
-- TOC entry 338 (class 1255 OID 48142)
-- Name: actualiza_clave(character varying, character varying); Type: FUNCTION; Schema: usuarios; Owner: -
--

CREATE FUNCTION actualiza_clave(iden character varying, contra character varying) RETURNS boolean
    LANGUAGE plpgsql
    AS $$
declare

BEGIN
		
		
		
		
		if exists (select usuarios from usuarios.usuarios where id = iden and id_estado = 'A') then
			UPDATE usuarios.usuarios
			SET  clave_clave = contra, estado_clave= true
		WHERE id = iden;
			return true;
		else 
			return raise  'El usuario no exixte o esta inactivo';
		end if;
			
END;
$$;


SET search_path = administracion, pg_catalog;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- TOC entry 176 (class 1259 OID 48143)
-- Name: actividad_economica; Type: TABLE; Schema: administracion; Owner: -; Tablespace: 
--

CREATE TABLE actividad_economica (
    id integer NOT NULL,
    nombre character varying(75) NOT NULL,
    descripcion character varying(500) NOT NULL,
    id_tipo_bienes_servicios integer,
    estado character varying(5) NOT NULL,
    fecha timestamp with time zone DEFAULT now() NOT NULL,
    imagen character varying(150)
);


--
-- TOC entry 177 (class 1259 OID 48150)
-- Name: actividad_economica_id_seq; Type: SEQUENCE; Schema: administracion; Owner: -
--

CREATE SEQUENCE actividad_economica_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3004 (class 0 OID 0)
-- Dependencies: 177
-- Name: actividad_economica_id_seq; Type: SEQUENCE OWNED BY; Schema: administracion; Owner: -
--

ALTER SEQUENCE actividad_economica_id_seq OWNED BY actividad_economica.id;


--
-- TOC entry 178 (class 1259 OID 48152)
-- Name: clientes; Type: TABLE; Schema: administracion; Owner: -; Tablespace: 
--

CREATE TABLE clientes (
    id character varying(50) NOT NULL,
    tipo_cliente integer NOT NULL,
    id_cliente integer NOT NULL,
    id_tipo_documento integer NOT NULL,
    fecha timestamp without time zone DEFAULT now() NOT NULL,
    estado character varying NOT NULL
);


--
-- TOC entry 179 (class 1259 OID 48159)
-- Name: empresas; Type: TABLE; Schema: administracion; Owner: -; Tablespace: 
--

CREATE TABLE empresas (
    id integer NOT NULL,
    razon_social character varying(250) NOT NULL,
    actividad_economica character varying(750),
    ruc_ci character varying(25) NOT NULL,
    nombre_comercial character varying(250),
    tipo_persona character varying(15),
    id_estado character varying(5) NOT NULL,
    fecha timestamp without time zone DEFAULT now() NOT NULL,
    tipo_empresa integer DEFAULT 1 NOT NULL
);


--
-- TOC entry 3005 (class 0 OID 0)
-- Dependencies: 179
-- Name: COLUMN empresas.id; Type: COMMENT; Schema: administracion; Owner: -
--

COMMENT ON COLUMN empresas.id IS 'define el identificador de la empresa';


--
-- TOC entry 3006 (class 0 OID 0)
-- Dependencies: 179
-- Name: COLUMN empresas.razon_social; Type: COMMENT; Schema: administracion; Owner: -
--

COMMENT ON COLUMN empresas.razon_social IS 'define la razon social de la empresa';


--
-- TOC entry 3007 (class 0 OID 0)
-- Dependencies: 179
-- Name: COLUMN empresas.actividad_economica; Type: COMMENT; Schema: administracion; Owner: -
--

COMMENT ON COLUMN empresas.actividad_economica IS 'actividad economica que realiza la empresa';


--
-- TOC entry 3008 (class 0 OID 0)
-- Dependencies: 179
-- Name: COLUMN empresas.ruc_ci; Type: COMMENT; Schema: administracion; Owner: -
--

COMMENT ON COLUMN empresas.ruc_ci IS 'ruc o cedula dependiendo el tipo de usuario';


--
-- TOC entry 3009 (class 0 OID 0)
-- Dependencies: 179
-- Name: COLUMN empresas.nombre_comercial; Type: COMMENT; Schema: administracion; Owner: -
--

COMMENT ON COLUMN empresas.nombre_comercial IS 'nombre con el que se le conoce a la empresa';


--
-- TOC entry 3010 (class 0 OID 0)
-- Dependencies: 179
-- Name: COLUMN empresas.tipo_persona; Type: COMMENT; Schema: administracion; Owner: -
--

COMMENT ON COLUMN empresas.tipo_persona IS 'tipo de persona natural o juridica segun SRI';


--
-- TOC entry 3011 (class 0 OID 0)
-- Dependencies: 179
-- Name: COLUMN empresas.id_estado; Type: COMMENT; Schema: administracion; Owner: -
--

COMMENT ON COLUMN empresas.id_estado IS 'define el estado de la empresa para el sistema Nexbook';


--
-- TOC entry 180 (class 1259 OID 48167)
-- Name: empresas_id_seq; Type: SEQUENCE; Schema: administracion; Owner: -
--

CREATE SEQUENCE empresas_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3012 (class 0 OID 0)
-- Dependencies: 180
-- Name: empresas_id_seq; Type: SEQUENCE OWNED BY; Schema: administracion; Owner: -
--

ALTER SEQUENCE empresas_id_seq OWNED BY empresas.id;


--
-- TOC entry 181 (class 1259 OID 48169)
-- Name: imagen_empresa; Type: TABLE; Schema: administracion; Owner: -; Tablespace: 
--

CREATE TABLE imagen_empresa (
    id integer NOT NULL,
    sucursal integer NOT NULL,
    direccion_imagen_empresa character varying(500) NOT NULL,
    direccion_imagen_recorte character varying(500),
    estado character varying(5) NOT NULL,
    fecha timestamp without time zone DEFAULT now() NOT NULL,
    tipo_imagen integer NOT NULL
);


--
-- TOC entry 182 (class 1259 OID 48176)
-- Name: imagen_empresa_id_seq; Type: SEQUENCE; Schema: administracion; Owner: -
--

CREATE SEQUENCE imagen_empresa_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3013 (class 0 OID 0)
-- Dependencies: 182
-- Name: imagen_empresa_id_seq; Type: SEQUENCE OWNED BY; Schema: administracion; Owner: -
--

ALTER SEQUENCE imagen_empresa_id_seq OWNED BY imagen_empresa.id;


--
-- TOC entry 183 (class 1259 OID 48178)
-- Name: sucursales_id_seq; Type: SEQUENCE; Schema: administracion; Owner: -
--

CREATE SEQUENCE sucursales_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 184 (class 1259 OID 48180)
-- Name: tipo_accion_vista; Type: TABLE; Schema: administracion; Owner: -; Tablespace: 
--

CREATE TABLE tipo_accion_vista (
    id integer NOT NULL,
    accion_ver boolean NOT NULL,
    accion_guardar boolean NOT NULL,
    accion_modificar boolean NOT NULL,
    estado character varying(5) NOT NULL,
    fecha timestamp without time zone DEFAULT now() NOT NULL
);


--
-- TOC entry 185 (class 1259 OID 48184)
-- Name: tipo_accion_vista_id_seq; Type: SEQUENCE; Schema: administracion; Owner: -
--

CREATE SEQUENCE tipo_accion_vista_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3014 (class 0 OID 0)
-- Dependencies: 185
-- Name: tipo_accion_vista_id_seq; Type: SEQUENCE OWNED BY; Schema: administracion; Owner: -
--

ALTER SEQUENCE tipo_accion_vista_id_seq OWNED BY tipo_accion_vista.id;


--
-- TOC entry 186 (class 1259 OID 48186)
-- Name: tipo_bienes_servicios; Type: TABLE; Schema: administracion; Owner: -; Tablespace: 
--

CREATE TABLE tipo_bienes_servicios (
    id integer NOT NULL,
    nombre character varying(75) NOT NULL,
    descripcion character varying(500) NOT NULL,
    fecha timestamp without time zone DEFAULT now() NOT NULL,
    estado character varying(5) NOT NULL,
    id_prestacion integer
);


--
-- TOC entry 187 (class 1259 OID 48193)
-- Name: tipo_bienes_servicios_id_seq; Type: SEQUENCE; Schema: administracion; Owner: -
--

CREATE SEQUENCE tipo_bienes_servicios_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3015 (class 0 OID 0)
-- Dependencies: 187
-- Name: tipo_bienes_servicios_id_seq; Type: SEQUENCE OWNED BY; Schema: administracion; Owner: -
--

ALTER SEQUENCE tipo_bienes_servicios_id_seq OWNED BY tipo_bienes_servicios.id;


--
-- TOC entry 188 (class 1259 OID 48195)
-- Name: tipo_empresa; Type: TABLE; Schema: administracion; Owner: -; Tablespace: 
--

CREATE TABLE tipo_empresa (
    id integer NOT NULL,
    nombre character(50) NOT NULL,
    descripcion character varying(500) NOT NULL,
    estado character varying(5) NOT NULL,
    fecha timestamp without time zone DEFAULT now() NOT NULL
);


--
-- TOC entry 189 (class 1259 OID 48202)
-- Name: tipo_empresa_id_seq; Type: SEQUENCE; Schema: administracion; Owner: -
--

CREATE SEQUENCE tipo_empresa_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3016 (class 0 OID 0)
-- Dependencies: 189
-- Name: tipo_empresa_id_seq; Type: SEQUENCE OWNED BY; Schema: administracion; Owner: -
--

ALTER SEQUENCE tipo_empresa_id_seq OWNED BY tipo_empresa.id;


--
-- TOC entry 190 (class 1259 OID 48204)
-- Name: tipos_imagenes_empresas; Type: TABLE; Schema: administracion; Owner: -; Tablespace: 
--

CREATE TABLE tipos_imagenes_empresas (
    id integer NOT NULL,
    nombre character varying(250) NOT NULL,
    estado character varying(5) NOT NULL,
    fecha timestamp with time zone DEFAULT now() NOT NULL
);


--
-- TOC entry 191 (class 1259 OID 48208)
-- Name: tipos_imagenes_productos_id_seq; Type: SEQUENCE; Schema: administracion; Owner: -
--

CREATE SEQUENCE tipos_imagenes_productos_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3017 (class 0 OID 0)
-- Dependencies: 191
-- Name: tipos_imagenes_productos_id_seq; Type: SEQUENCE OWNED BY; Schema: administracion; Owner: -
--

ALTER SEQUENCE tipos_imagenes_productos_id_seq OWNED BY tipos_imagenes_empresas.id;


--
-- TOC entry 192 (class 1259 OID 48210)
-- Name: usuarios_privilegios; Type: TABLE; Schema: administracion; Owner: -; Tablespace: 
--

CREATE TABLE usuarios_privilegios (
    id integer NOT NULL,
    estado character varying(5) NOT NULL,
    fecha timestamp without time zone DEFAULT now() NOT NULL,
    id_vista integer NOT NULL,
    id_tipo_usuario integer NOT NULL,
    id_tipo_accion_vistas integer NOT NULL
);


--
-- TOC entry 193 (class 1259 OID 48214)
-- Name: usuarios_privilegios_id_seq; Type: SEQUENCE; Schema: administracion; Owner: -
--

CREATE SEQUENCE usuarios_privilegios_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3018 (class 0 OID 0)
-- Dependencies: 193
-- Name: usuarios_privilegios_id_seq; Type: SEQUENCE OWNED BY; Schema: administracion; Owner: -
--

ALTER SEQUENCE usuarios_privilegios_id_seq OWNED BY usuarios_privilegios.id;


--
-- TOC entry 194 (class 1259 OID 48216)
-- Name: vistas; Type: TABLE; Schema: administracion; Owner: -; Tablespace: 
--

CREATE TABLE vistas (
    id integer NOT NULL,
    nombre character varying(200) NOT NULL,
    path character varying(500) NOT NULL,
    url character varying(750) NOT NULL,
    personalizacion json DEFAULT '{"icon": "pages"}'::json NOT NULL,
    estado character varying(5) NOT NULL,
    id_padre integer NOT NULL,
    nivel_arbol integer NOT NULL,
    template_ character varying(500) NOT NULL,
    controller_ character varying(500) NOT NULL,
    fecha timestamp without time zone DEFAULT now() NOT NULL
);


--
-- TOC entry 195 (class 1259 OID 48224)
-- Name: vistas_id_seq; Type: SEQUENCE; Schema: administracion; Owner: -
--

CREATE SEQUENCE vistas_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3019 (class 0 OID 0)
-- Dependencies: 195
-- Name: vistas_id_seq; Type: SEQUENCE OWNED BY; Schema: administracion; Owner: -
--

ALTER SEQUENCE vistas_id_seq OWNED BY vistas.id;


SET search_path = auditoria, pg_catalog;

--
-- TOC entry 196 (class 1259 OID 48226)
-- Name: auditoria; Type: TABLE; Schema: auditoria; Owner: -; Tablespace: 
--

CREATE TABLE auditoria (
    id integer NOT NULL,
    tabla_afectada character(45) NOT NULL,
    operacion character(1) NOT NULL,
    variable_anterior text,
    variable_nueva text,
    fecha timestamp without time zone NOT NULL,
    usuario character(45) NOT NULL
);


--
-- TOC entry 3020 (class 0 OID 0)
-- Dependencies: 196
-- Name: COLUMN auditoria.id; Type: COMMENT; Schema: auditoria; Owner: -
--

COMMENT ON COLUMN auditoria.id IS 'define el identificador de la tabla auditoria';


--
-- TOC entry 3021 (class 0 OID 0)
-- Dependencies: 196
-- Name: COLUMN auditoria.tabla_afectada; Type: COMMENT; Schema: auditoria; Owner: -
--

COMMENT ON COLUMN auditoria.tabla_afectada IS 'almacena el nombre de la tabla que fue afectada';


--
-- TOC entry 3022 (class 0 OID 0)
-- Dependencies: 196
-- Name: COLUMN auditoria.operacion; Type: COMMENT; Schema: auditoria; Owner: -
--

COMMENT ON COLUMN auditoria.operacion IS 'guarda la operacion realizada, I insertar / U actualizar/ D borrar  ';


--
-- TOC entry 3023 (class 0 OID 0)
-- Dependencies: 196
-- Name: COLUMN auditoria.variable_anterior; Type: COMMENT; Schema: auditoria; Owner: -
--

COMMENT ON COLUMN auditoria.variable_anterior IS 'almacena los valores viejos';


--
-- TOC entry 3024 (class 0 OID 0)
-- Dependencies: 196
-- Name: COLUMN auditoria.variable_nueva; Type: COMMENT; Schema: auditoria; Owner: -
--

COMMENT ON COLUMN auditoria.variable_nueva IS 'almacena los valores nuevos';


--
-- TOC entry 3025 (class 0 OID 0)
-- Dependencies: 196
-- Name: COLUMN auditoria.fecha; Type: COMMENT; Schema: auditoria; Owner: -
--

COMMENT ON COLUMN auditoria.fecha IS 'almacena la fecha de modificacion de los datos';


--
-- TOC entry 3026 (class 0 OID 0)
-- Dependencies: 196
-- Name: COLUMN auditoria.usuario; Type: COMMENT; Schema: auditoria; Owner: -
--

COMMENT ON COLUMN auditoria.usuario IS 'almacena el usuario de la BDD';


--
-- TOC entry 197 (class 1259 OID 48232)
-- Name: auditoria_id_seq; Type: SEQUENCE; Schema: auditoria; Owner: -
--

CREATE SEQUENCE auditoria_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3027 (class 0 OID 0)
-- Dependencies: 197
-- Name: auditoria_id_seq; Type: SEQUENCE OWNED BY; Schema: auditoria; Owner: -
--

ALTER SEQUENCE auditoria_id_seq OWNED BY auditoria.id;


--
-- TOC entry 198 (class 1259 OID 48234)
-- Name: ingresos_usuarios; Type: TABLE; Schema: auditoria; Owner: -; Tablespace: 
--

CREATE TABLE ingresos_usuarios (
    id integer NOT NULL,
    usuario character varying(100) NOT NULL,
    informacion_servidor json NOT NULL,
    fecha timestamp without time zone DEFAULT now() NOT NULL,
    ip_acceso json NOT NULL
);


--
-- TOC entry 199 (class 1259 OID 48241)
-- Name: ingresos_usuarios_id_seq; Type: SEQUENCE; Schema: auditoria; Owner: -
--

CREATE SEQUENCE ingresos_usuarios_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3028 (class 0 OID 0)
-- Dependencies: 199
-- Name: ingresos_usuarios_id_seq; Type: SEQUENCE OWNED BY; Schema: auditoria; Owner: -
--

ALTER SEQUENCE ingresos_usuarios_id_seq OWNED BY ingresos_usuarios.id;


SET search_path = contabilidad, pg_catalog;

--
-- TOC entry 200 (class 1259 OID 48243)
-- Name: plazos_credito; Type: TABLE; Schema: contabilidad; Owner: -; Tablespace: 
--

CREATE TABLE plazos_credito (
    id integer NOT NULL,
    nombre character varying(50) NOT NULL,
    dias_credito integer DEFAULT 0 NOT NULL,
    estado character varying(5) NOT NULL,
    fecha time without time zone DEFAULT now() NOT NULL
);


--
-- TOC entry 201 (class 1259 OID 48248)
-- Name: Plazos_credito_id_seq; Type: SEQUENCE; Schema: contabilidad; Owner: -
--

CREATE SEQUENCE "Plazos_credito_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3029 (class 0 OID 0)
-- Dependencies: 201
-- Name: Plazos_credito_id_seq; Type: SEQUENCE OWNED BY; Schema: contabilidad; Owner: -
--

ALTER SEQUENCE "Plazos_credito_id_seq" OWNED BY plazos_credito.id;


--
-- TOC entry 202 (class 1259 OID 48250)
-- Name: ambitos_impuestos; Type: TABLE; Schema: contabilidad; Owner: -; Tablespace: 
--

CREATE TABLE ambitos_impuestos (
    id integer NOT NULL,
    nombre character varying(250) NOT NULL,
    estado character varying(5) NOT NULL,
    fecha date DEFAULT now() NOT NULL
);


--
-- TOC entry 203 (class 1259 OID 48254)
-- Name: ambitos_impuestos_id_seq; Type: SEQUENCE; Schema: contabilidad; Owner: -
--

CREATE SEQUENCE ambitos_impuestos_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3030 (class 0 OID 0)
-- Dependencies: 203
-- Name: ambitos_impuestos_id_seq; Type: SEQUENCE OWNED BY; Schema: contabilidad; Owner: -
--

ALTER SEQUENCE ambitos_impuestos_id_seq OWNED BY ambitos_impuestos.id;


--
-- TOC entry 204 (class 1259 OID 48256)
-- Name: asientos_contables_diario; Type: TABLE; Schema: contabilidad; Owner: -; Tablespace: 
--

CREATE TABLE asientos_contables_diario (
    id integer NOT NULL,
    id_tipo_cuenta_contable integer NOT NULL,
    referencia_asiento character varying(75),
    debe real,
    haber real,
    fecha date DEFAULT now() NOT NULL,
    estado character varying(5) NOT NULL
);


--
-- TOC entry 205 (class 1259 OID 48260)
-- Name: asientos_contables_diario_id_seq; Type: SEQUENCE; Schema: contabilidad; Owner: -
--

CREATE SEQUENCE asientos_contables_diario_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3031 (class 0 OID 0)
-- Dependencies: 205
-- Name: asientos_contables_diario_id_seq; Type: SEQUENCE OWNED BY; Schema: contabilidad; Owner: -
--

ALTER SEQUENCE asientos_contables_diario_id_seq OWNED BY asientos_contables_diario.id;


--
-- TOC entry 206 (class 1259 OID 48262)
-- Name: bancos; Type: TABLE; Schema: contabilidad; Owner: -; Tablespace: 
--

CREATE TABLE bancos (
    id integer NOT NULL,
    nombre_banco character varying(250) NOT NULL,
    numero_cuanta character varying(25) NOT NULL,
    titular_cuenta integer NOT NULL,
    direccion_sucursal_banco character varying(500) NOT NULL,
    estado character varying(5) NOT NULL,
    fecha time with time zone DEFAULT now() NOT NULL
);


--
-- TOC entry 207 (class 1259 OID 48269)
-- Name: bancos_id_seq; Type: SEQUENCE; Schema: contabilidad; Owner: -
--

CREATE SEQUENCE bancos_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3032 (class 0 OID 0)
-- Dependencies: 207
-- Name: bancos_id_seq; Type: SEQUENCE OWNED BY; Schema: contabilidad; Owner: -
--

ALTER SEQUENCE bancos_id_seq OWNED BY bancos.id;


--
-- TOC entry 208 (class 1259 OID 48271)
-- Name: cuentas_contables; Type: TABLE; Schema: contabilidad; Owner: -; Tablespace: 
--

CREATE TABLE cuentas_contables (
    id integer NOT NULL,
    codigo_contable character varying NOT NULL,
    nombre_corto character varying(50) NOT NULL,
    descripcion character varying(500) NOT NULL,
    signo_cuenta character(1) DEFAULT 0 NOT NULL,
    tipo_cuenta integer NOT NULL
);


--
-- TOC entry 209 (class 1259 OID 48278)
-- Name: cuentas_contables_id_seq; Type: SEQUENCE; Schema: contabilidad; Owner: -
--

CREATE SEQUENCE cuentas_contables_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3033 (class 0 OID 0)
-- Dependencies: 209
-- Name: cuentas_contables_id_seq; Type: SEQUENCE OWNED BY; Schema: contabilidad; Owner: -
--

ALTER SEQUENCE cuentas_contables_id_seq OWNED BY cuentas_contables.id;


--
-- TOC entry 210 (class 1259 OID 48280)
-- Name: repositorio_facturas_correo; Type: TABLE; Schema: contabilidad; Owner: -; Tablespace: 
--

CREATE TABLE repositorio_facturas_correo (
    id integer NOT NULL,
    ruta_acceso character varying(500) NOT NULL,
    id_correo character varying(75) NOT NULL,
    estado_proceso_factura boolean NOT NULL,
    emisor_factura character varying(250) NOT NULL,
    nombre_archivo character varying(75) NOT NULL,
    fecha date DEFAULT now() NOT NULL,
    asunto character varying(250)
);


--
-- TOC entry 211 (class 1259 OID 48287)
-- Name: facturas_correo_id_seq; Type: SEQUENCE; Schema: contabilidad; Owner: -
--

CREATE SEQUENCE facturas_correo_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3034 (class 0 OID 0)
-- Dependencies: 211
-- Name: facturas_correo_id_seq; Type: SEQUENCE OWNED BY; Schema: contabilidad; Owner: -
--

ALTER SEQUENCE facturas_correo_id_seq OWNED BY repositorio_facturas_correo.id;


--
-- TOC entry 212 (class 1259 OID 48289)
-- Name: fecha_declaracion_ruc; Type: TABLE; Schema: contabilidad; Owner: -; Tablespace: 
--

CREATE TABLE fecha_declaracion_ruc (
    noveno_dig integer NOT NULL,
    fecha_maxima_declaracion character varying(50) NOT NULL,
    numero_dias integer NOT NULL
);


--
-- TOC entry 213 (class 1259 OID 48292)
-- Name: finaciaminto; Type: TABLE; Schema: contabilidad; Owner: -; Tablespace: 
--

CREATE TABLE finaciaminto (
    id integer NOT NULL,
    id_factura integer NOT NULL,
    total_factura real NOT NULL,
    pago_parcial real NOT NULL,
    numero_cuotas integer NOT NULL,
    id_plazos_credito integer NOT NULL,
    fecha_prestamo time without time zone DEFAULT now() NOT NULL,
    subtotal_sin_iva real NOT NULL,
    subtotal_iva real NOT NULL,
    iva real NOT NULL,
    fecha_vencimiento time without time zone NOT NULL,
    estado_pago character varying(5) NOT NULL,
    porcentaje_sin_iva real NOT NULL,
    porcentaje_iva real NOT NULL,
    porcentaje_con_iva real NOT NULL
);


--
-- TOC entry 214 (class 1259 OID 48296)
-- Name: finaciaminto_id_seq; Type: SEQUENCE; Schema: contabilidad; Owner: -
--

CREATE SEQUENCE finaciaminto_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3035 (class 0 OID 0)
-- Dependencies: 214
-- Name: finaciaminto_id_seq; Type: SEQUENCE OWNED BY; Schema: contabilidad; Owner: -
--

ALTER SEQUENCE finaciaminto_id_seq OWNED BY finaciaminto.id;


--
-- TOC entry 215 (class 1259 OID 48298)
-- Name: gasto_mes_repositorio; Type: TABLE; Schema: contabilidad; Owner: -; Tablespace: 
--

CREATE TABLE gasto_mes_repositorio (
    id integer NOT NULL,
    id_factura integer NOT NULL,
    id_tipo_gasto integer NOT NULL,
    total_gasto real NOT NULL,
    fecha date DEFAULT now() NOT NULL,
    estado_revicion character varying(5)
);


--
-- TOC entry 216 (class 1259 OID 48302)
-- Name: gasto_mes_repositorio_id_seq; Type: SEQUENCE; Schema: contabilidad; Owner: -
--

CREATE SEQUENCE gasto_mes_repositorio_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3036 (class 0 OID 0)
-- Dependencies: 216
-- Name: gasto_mes_repositorio_id_seq; Type: SEQUENCE OWNED BY; Schema: contabilidad; Owner: -
--

ALTER SEQUENCE gasto_mes_repositorio_id_seq OWNED BY gasto_mes_repositorio.id;


--
-- TOC entry 217 (class 1259 OID 48304)
-- Name: gastos_impuestos_renta_deduccion; Type: TABLE; Schema: contabilidad; Owner: -; Tablespace: 
--

CREATE TABLE gastos_impuestos_renta_deduccion (
    id integer NOT NULL,
    id_factura integer NOT NULL,
    id_tipo_gasto_personal integer NOT NULL,
    valor_acumular real NOT NULL,
    estado character varying(5) NOT NULL,
    fecha date DEFAULT now() NOT NULL
);


--
-- TOC entry 218 (class 1259 OID 48308)
-- Name: gastos_impuestos_renta_deduccion_id_seq; Type: SEQUENCE; Schema: contabilidad; Owner: -
--

CREATE SEQUENCE gastos_impuestos_renta_deduccion_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3037 (class 0 OID 0)
-- Dependencies: 218
-- Name: gastos_impuestos_renta_deduccion_id_seq; Type: SEQUENCE OWNED BY; Schema: contabilidad; Owner: -
--

ALTER SEQUENCE gastos_impuestos_renta_deduccion_id_seq OWNED BY gastos_impuestos_renta_deduccion.id;


--
-- TOC entry 219 (class 1259 OID 48310)
-- Name: genealogia_impuestos; Type: TABLE; Schema: contabilidad; Owner: -; Tablespace: 
--

CREATE TABLE genealogia_impuestos (
    id_impuesto_padre integer NOT NULL,
    id_impuesto_hijo integer NOT NULL
);


--
-- TOC entry 3038 (class 0 OID 0)
-- Dependencies: 219
-- Name: TABLE genealogia_impuestos; Type: COMMENT; Schema: contabilidad; Owner: -
--

COMMENT ON TABLE genealogia_impuestos IS 'define el arbol de los impuestos para el grupo';


--
-- TOC entry 220 (class 1259 OID 48313)
-- Name: grupo_impuestos; Type: TABLE; Schema: contabilidad; Owner: -; Tablespace: 
--

CREATE TABLE grupo_impuestos (
    id integer NOT NULL,
    nombre character varying(250) NOT NULL,
    estado character varying(5) NOT NULL,
    fecha timestamp with time zone NOT NULL
);


--
-- TOC entry 221 (class 1259 OID 48316)
-- Name: grupo_impuestos_id_seq; Type: SEQUENCE; Schema: contabilidad; Owner: -
--

CREATE SEQUENCE grupo_impuestos_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3039 (class 0 OID 0)
-- Dependencies: 221
-- Name: grupo_impuestos_id_seq; Type: SEQUENCE OWNED BY; Schema: contabilidad; Owner: -
--

ALTER SEQUENCE grupo_impuestos_id_seq OWNED BY grupo_impuestos.id;


--
-- TOC entry 222 (class 1259 OID 48318)
-- Name: impuestos; Type: TABLE; Schema: contabilidad; Owner: -; Tablespace: 
--

CREATE TABLE impuestos (
    id integer NOT NULL,
    codigo_sri character varying(5) NOT NULL,
    nombre character varying(250) NOT NULL,
    descripcion character varying(2000) NOT NULL,
    cantidad integer NOT NULL,
    estado character varying(5) NOT NULL,
    fecha date DEFAULT now() NOT NULL,
    ambito integer NOT NULL,
    tipo_impuesto integer DEFAULT 0 NOT NULL
);


--
-- TOC entry 223 (class 1259 OID 48326)
-- Name: impuestos_id_seq; Type: SEQUENCE; Schema: contabilidad; Owner: -
--

CREATE SEQUENCE impuestos_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3040 (class 0 OID 0)
-- Dependencies: 223
-- Name: impuestos_id_seq; Type: SEQUENCE OWNED BY; Schema: contabilidad; Owner: -
--

ALTER SEQUENCE impuestos_id_seq OWNED BY impuestos.id;


--
-- TOC entry 224 (class 1259 OID 48328)
-- Name: repositorio_facturas; Type: TABLE; Schema: contabilidad; Owner: -; Tablespace: 
--

CREATE TABLE repositorio_facturas (
    id_factura integer NOT NULL,
    num_factura character varying(50) NOT NULL,
    nombre_comercial character varying(50) NOT NULL,
    clave_acceso character varying(50),
    ruc_prov character varying(25) NOT NULL,
    tipo_doc character varying(5) NOT NULL,
    total character varying(255) NOT NULL,
    contenido_fac json NOT NULL,
    created_at timestamp(0) without time zone DEFAULT now(),
    id_sucursal character varying,
    fecha_emision date,
    subtotal_12 character varying(50),
    subtotal_0 character varying(50),
    subtotal_no_sujeto character varying(50),
    subtotal_exento_iva character varying(50),
    subtotal_sin_impuestos character varying(50),
    descuento character varying(50),
    ice character varying(50),
    iva_12 character varying(50),
    propina character varying(50),
    estado character varying(5),
    estado_view character varying(5)
);


--
-- TOC entry 225 (class 1259 OID 48335)
-- Name: repositorio_facturas_id_factura_seq; Type: SEQUENCE; Schema: contabilidad; Owner: -
--

CREATE SEQUENCE repositorio_facturas_id_factura_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3041 (class 0 OID 0)
-- Dependencies: 225
-- Name: repositorio_facturas_id_factura_seq; Type: SEQUENCE OWNED BY; Schema: contabilidad; Owner: -
--

ALTER SEQUENCE repositorio_facturas_id_factura_seq OWNED BY repositorio_facturas.id_factura;


--
-- TOC entry 226 (class 1259 OID 48337)
-- Name: repositorio_facturas_rechazadas; Type: TABLE; Schema: contabilidad; Owner: -; Tablespace: 
--

CREATE TABLE repositorio_facturas_rechazadas (
    id_factura_r integer NOT NULL,
    clave_acceso character varying(75),
    razon_rechazo character varying(255) NOT NULL,
    created_at timestamp(0) without time zone DEFAULT now(),
    estado character varying(5),
    contenido_correo character varying(20000),
    emisor_factura character varying(75),
    asunto character varying(200)
);


--
-- TOC entry 227 (class 1259 OID 48344)
-- Name: repositorio_facturas_rechazadas_id_factura_r_seq; Type: SEQUENCE; Schema: contabilidad; Owner: -
--

CREATE SEQUENCE repositorio_facturas_rechazadas_id_factura_r_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3042 (class 0 OID 0)
-- Dependencies: 227
-- Name: repositorio_facturas_rechazadas_id_factura_r_seq; Type: SEQUENCE OWNED BY; Schema: contabilidad; Owner: -
--

ALTER SEQUENCE repositorio_facturas_rechazadas_id_factura_r_seq OWNED BY repositorio_facturas_rechazadas.id_factura_r;


--
-- TOC entry 228 (class 1259 OID 48346)
-- Name: rol_pagos_empleados; Type: TABLE; Schema: contabilidad; Owner: -; Tablespace: 
--

CREATE TABLE rol_pagos_empleados (
    id integer NOT NULL,
    id_empleado integer NOT NULL,
    mes_pago character varying(50) DEFAULT date_part('month'::text, now()) NOT NULL
);


--
-- TOC entry 229 (class 1259 OID 48350)
-- Name: rol_pagos_empleados_id_seq; Type: SEQUENCE; Schema: contabilidad; Owner: -
--

CREATE SEQUENCE rol_pagos_empleados_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3043 (class 0 OID 0)
-- Dependencies: 229
-- Name: rol_pagos_empleados_id_seq; Type: SEQUENCE OWNED BY; Schema: contabilidad; Owner: -
--

ALTER SEQUENCE rol_pagos_empleados_id_seq OWNED BY rol_pagos_empleados.id;


--
-- TOC entry 230 (class 1259 OID 48352)
-- Name: tipos_cuentas_contables; Type: TABLE; Schema: contabilidad; Owner: -; Tablespace: 
--

CREATE TABLE tipos_cuentas_contables (
    id integer NOT NULL,
    nombre character varying(250) NOT NULL,
    descripcion character varying(500) NOT NULL,
    estado character varying(5) NOT NULL,
    fecha timestamp without time zone DEFAULT now() NOT NULL
);


--
-- TOC entry 231 (class 1259 OID 48359)
-- Name: tipo_cuenta_contable_id_seq; Type: SEQUENCE; Schema: contabilidad; Owner: -
--

CREATE SEQUENCE tipo_cuenta_contable_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3044 (class 0 OID 0)
-- Dependencies: 231
-- Name: tipo_cuenta_contable_id_seq; Type: SEQUENCE OWNED BY; Schema: contabilidad; Owner: -
--

ALTER SEQUENCE tipo_cuenta_contable_id_seq OWNED BY tipos_cuentas_contables.id;


--
-- TOC entry 232 (class 1259 OID 48361)
-- Name: tipo_documentos; Type: TABLE; Schema: contabilidad; Owner: -; Tablespace: 
--

CREATE TABLE tipo_documentos (
    id character varying(5) NOT NULL,
    nombre character varying(50) NOT NULL,
    descripcion character varying(250) NOT NULL,
    estado character varying(5) NOT NULL,
    fecha timestamp(0) without time zone DEFAULT now()
);


--
-- TOC entry 233 (class 1259 OID 48365)
-- Name: tipo_impuestos; Type: TABLE; Schema: contabilidad; Owner: -; Tablespace: 
--

CREATE TABLE tipo_impuestos (
    id integer NOT NULL,
    nombre character varying(50) NOT NULL,
    descripcion character varying(250) NOT NULL,
    estado character varying(5) NOT NULL,
    fecha timestamp(0) without time zone DEFAULT now()
);


--
-- TOC entry 234 (class 1259 OID 48369)
-- Name: tipo_impuestos_id_seq; Type: SEQUENCE; Schema: contabilidad; Owner: -
--

CREATE SEQUENCE tipo_impuestos_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3045 (class 0 OID 0)
-- Dependencies: 234
-- Name: tipo_impuestos_id_seq; Type: SEQUENCE OWNED BY; Schema: contabilidad; Owner: -
--

ALTER SEQUENCE tipo_impuestos_id_seq OWNED BY tipo_impuestos.id;


--
-- TOC entry 235 (class 1259 OID 48371)
-- Name: tipos_gastos_personales; Type: TABLE; Schema: contabilidad; Owner: -; Tablespace: 
--

CREATE TABLE tipos_gastos_personales (
    id integer NOT NULL,
    nombre character varying(50) NOT NULL,
    descripcion character varying(500) NOT NULL,
    valor_maximo real NOT NULL,
    estado character varying(5),
    fecha date DEFAULT now() NOT NULL
);


--
-- TOC entry 236 (class 1259 OID 48378)
-- Name: tipos_gastos_personales_id_seq; Type: SEQUENCE; Schema: contabilidad; Owner: -
--

CREATE SEQUENCE tipos_gastos_personales_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3046 (class 0 OID 0)
-- Dependencies: 236
-- Name: tipos_gastos_personales_id_seq; Type: SEQUENCE OWNED BY; Schema: contabilidad; Owner: -
--

ALTER SEQUENCE tipos_gastos_personales_id_seq OWNED BY tipos_gastos_personales.id;


SET search_path = inventario, pg_catalog;

--
-- TOC entry 237 (class 1259 OID 48380)
-- Name: bodegas; Type: TABLE; Schema: inventario; Owner: -; Tablespace: 
--

CREATE TABLE bodegas (
    id integer NOT NULL,
    id_sucursal integer NOT NULL,
    nombre character varying(75) NOT NULL,
    calle character varying(70) NOT NULL,
    numero character varying(10) NOT NULL,
    especificaciones character varying(500),
    fecha timestamp without time zone DEFAULT now() NOT NULL,
    estado character varying(5) NOT NULL,
    giro_negocio integer NOT NULL
);


--
-- TOC entry 238 (class 1259 OID 48387)
-- Name: bodegas_id_seq; Type: SEQUENCE; Schema: inventario; Owner: -
--

CREATE SEQUENCE bodegas_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3047 (class 0 OID 0)
-- Dependencies: 238
-- Name: bodegas_id_seq; Type: SEQUENCE OWNED BY; Schema: inventario; Owner: -
--

ALTER SEQUENCE bodegas_id_seq OWNED BY bodegas.id;


--
-- TOC entry 239 (class 1259 OID 48389)
-- Name: catalogos; Type: TABLE; Schema: inventario; Owner: -; Tablespace: 
--

CREATE TABLE catalogos (
    id integer NOT NULL,
    tipo_catalogo integer NOT NULL,
    producto integer NOT NULL
);


--
-- TOC entry 240 (class 1259 OID 48392)
-- Name: catalogos_id_seq; Type: SEQUENCE; Schema: inventario; Owner: -
--

CREATE SEQUENCE catalogos_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3048 (class 0 OID 0)
-- Dependencies: 240
-- Name: catalogos_id_seq; Type: SEQUENCE OWNED BY; Schema: inventario; Owner: -
--

ALTER SEQUENCE catalogos_id_seq OWNED BY catalogos.id;


--
-- TOC entry 241 (class 1259 OID 48394)
-- Name: categorias; Type: TABLE; Schema: inventario; Owner: -; Tablespace: 
--

CREATE TABLE categorias (
    id integer NOT NULL,
    nombre character varying(50),
    descripcion character varying(2000) NOT NULL,
    tipo_categoria integer,
    estado character varying(5) NOT NULL,
    fecha timestamp with time zone DEFAULT now() NOT NULL,
    id_padre integer DEFAULT 0 NOT NULL
);


--
-- TOC entry 242 (class 1259 OID 48402)
-- Name: categorias_id_seq; Type: SEQUENCE; Schema: inventario; Owner: -
--

CREATE SEQUENCE categorias_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3049 (class 0 OID 0)
-- Dependencies: 242
-- Name: categorias_id_seq; Type: SEQUENCE OWNED BY; Schema: inventario; Owner: -
--

ALTER SEQUENCE categorias_id_seq OWNED BY categorias.id;


--
-- TOC entry 243 (class 1259 OID 48404)
-- Name: descripcion_producto; Type: TABLE; Schema: inventario; Owner: -; Tablespace: 
--

CREATE TABLE descripcion_producto (
    id integer NOT NULL,
    producto integer NOT NULL,
    descripcion_corta character varying(2000) NOT NULL,
    descripcion_proveedor character varying(4000) NOT NULL,
    descripcion_proformas character varying(4000) NOT NULL,
    descripcion_movi_inventa character varying(4000) NOT NULL
);


--
-- TOC entry 3050 (class 0 OID 0)
-- Dependencies: 243
-- Name: COLUMN descripcion_producto.descripcion_corta; Type: COMMENT; Schema: inventario; Owner: -
--

COMMENT ON COLUMN descripcion_producto.descripcion_corta IS 'descripcion en caso de ubicar en la factura';


--
-- TOC entry 3051 (class 0 OID 0)
-- Dependencies: 243
-- Name: COLUMN descripcion_producto.descripcion_proveedor; Type: COMMENT; Schema: inventario; Owner: -
--

COMMENT ON COLUMN descripcion_producto.descripcion_proveedor IS 'descripcion para poner en solicitud del proveedor';


--
-- TOC entry 244 (class 1259 OID 48410)
-- Name: descripcion_producto_id_seq; Type: SEQUENCE; Schema: inventario; Owner: -
--

CREATE SEQUENCE descripcion_producto_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3052 (class 0 OID 0)
-- Dependencies: 244
-- Name: descripcion_producto_id_seq; Type: SEQUENCE OWNED BY; Schema: inventario; Owner: -
--

ALTER SEQUENCE descripcion_producto_id_seq OWNED BY descripcion_producto.id;


--
-- TOC entry 245 (class 1259 OID 48412)
-- Name: estado_descriptivo; Type: TABLE; Schema: inventario; Owner: -; Tablespace: 
--

CREATE TABLE estado_descriptivo (
    id integer NOT NULL,
    nombre character varying(250) NOT NULL,
    descripcion character varying(2000) NOT NULL,
    estado character varying(5) NOT NULL,
    fecha timestamp with time zone DEFAULT now() NOT NULL,
    id_padre integer
);


--
-- TOC entry 246 (class 1259 OID 48419)
-- Name: estado_descriptivo_id_seq; Type: SEQUENCE; Schema: inventario; Owner: -
--

CREATE SEQUENCE estado_descriptivo_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3053 (class 0 OID 0)
-- Dependencies: 246
-- Name: estado_descriptivo_id_seq; Type: SEQUENCE OWNED BY; Schema: inventario; Owner: -
--

ALTER SEQUENCE estado_descriptivo_id_seq OWNED BY estado_descriptivo.id;


--
-- TOC entry 247 (class 1259 OID 48421)
-- Name: garantias; Type: TABLE; Schema: inventario; Owner: -; Tablespace: 
--

CREATE TABLE garantias (
    id integer NOT NULL,
    nombre character varying(50) NOT NULL,
    descripcion character varying(2000),
    estado character varying(5) NOT NULL,
    fecha timestamp with time zone DEFAULT now() NOT NULL,
    tipo_garantia integer NOT NULL,
    duracion integer NOT NULL,
    id_padre integer NOT NULL
);


--
-- TOC entry 3054 (class 0 OID 0)
-- Dependencies: 247
-- Name: COLUMN garantias.duracion; Type: COMMENT; Schema: inventario; Owner: -
--

COMMENT ON COLUMN garantias.duracion IS 'duracion en meses de la garantia';


--
-- TOC entry 248 (class 1259 OID 48428)
-- Name: garantias_id_seq; Type: SEQUENCE; Schema: inventario; Owner: -
--

CREATE SEQUENCE garantias_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3055 (class 0 OID 0)
-- Dependencies: 248
-- Name: garantias_id_seq; Type: SEQUENCE OWNED BY; Schema: inventario; Owner: -
--

ALTER SEQUENCE garantias_id_seq OWNED BY garantias.id;


--
-- TOC entry 249 (class 1259 OID 48430)
-- Name: imagenes_productos; Type: TABLE; Schema: inventario; Owner: -; Tablespace: 
--

CREATE TABLE imagenes_productos (
    id character varying(25) NOT NULL,
    nombre character varying(50) NOT NULL,
    direccion character varying(250) NOT NULL,
    tipo_imagen integer NOT NULL,
    estado character varying(5) NOT NULL,
    fecha time without time zone DEFAULT now() NOT NULL,
    producto integer NOT NULL
);


--
-- TOC entry 3056 (class 0 OID 0)
-- Dependencies: 249
-- Name: COLUMN imagenes_productos.id; Type: COMMENT; Schema: inventario; Owner: -
--

COMMENT ON COLUMN imagenes_productos.id IS 'identificador';


--
-- TOC entry 3057 (class 0 OID 0)
-- Dependencies: 249
-- Name: COLUMN imagenes_productos.nombre; Type: COMMENT; Schema: inventario; Owner: -
--

COMMENT ON COLUMN imagenes_productos.nombre IS 'nombre de la imagen';


--
-- TOC entry 3058 (class 0 OID 0)
-- Dependencies: 249
-- Name: COLUMN imagenes_productos.direccion; Type: COMMENT; Schema: inventario; Owner: -
--

COMMENT ON COLUMN imagenes_productos.direccion IS 'direccion donde se encuentra la imagen';


--
-- TOC entry 3059 (class 0 OID 0)
-- Dependencies: 249
-- Name: COLUMN imagenes_productos.tipo_imagen; Type: COMMENT; Schema: inventario; Owner: -
--

COMMENT ON COLUMN imagenes_productos.tipo_imagen IS 'codigo del tipo de imagen';


--
-- TOC entry 250 (class 1259 OID 48434)
-- Name: manejo_presios; Type: TABLE; Schema: inventario; Owner: -; Tablespace: 
--

CREATE TABLE manejo_presios (
    id integer NOT NULL,
    id_producto integer NOT NULL,
    nombre character varying NOT NULL,
    valor_precio real NOT NULL,
    estado character varying NOT NULL,
    fecha timestamp without time zone DEFAULT now() NOT NULL
);


--
-- TOC entry 251 (class 1259 OID 48441)
-- Name: manejo_presios_id_seq; Type: SEQUENCE; Schema: inventario; Owner: -
--

CREATE SEQUENCE manejo_presios_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3060 (class 0 OID 0)
-- Dependencies: 251
-- Name: manejo_presios_id_seq; Type: SEQUENCE OWNED BY; Schema: inventario; Owner: -
--

ALTER SEQUENCE manejo_presios_id_seq OWNED BY manejo_presios.id;


--
-- TOC entry 252 (class 1259 OID 48443)
-- Name: marcas; Type: TABLE; Schema: inventario; Owner: -; Tablespace: 
--

CREATE TABLE marcas (
    id integer NOT NULL,
    nombre character varying(50) NOT NULL,
    descripcion character varying(2000) NOT NULL,
    estado character varying(5) NOT NULL,
    fecha timestamp with time zone DEFAULT now() NOT NULL,
    id_padre integer NOT NULL
);


--
-- TOC entry 253 (class 1259 OID 48450)
-- Name: marcas_id_seq; Type: SEQUENCE; Schema: inventario; Owner: -
--

CREATE SEQUENCE marcas_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3061 (class 0 OID 0)
-- Dependencies: 253
-- Name: marcas_id_seq; Type: SEQUENCE OWNED BY; Schema: inventario; Owner: -
--

ALTER SEQUENCE marcas_id_seq OWNED BY marcas.id;


--
-- TOC entry 254 (class 1259 OID 48452)
-- Name: modelos; Type: TABLE; Schema: inventario; Owner: -; Tablespace: 
--

CREATE TABLE modelos (
    id integer NOT NULL,
    nombre character varying(250) NOT NULL,
    descripcion character varying(2000) NOT NULL,
    estado character varying(5) NOT NULL,
    fecha timestamp with time zone DEFAULT now() NOT NULL,
    id_padre integer NOT NULL
);


--
-- TOC entry 255 (class 1259 OID 48459)
-- Name: modelos_id_seq; Type: SEQUENCE; Schema: inventario; Owner: -
--

CREATE SEQUENCE modelos_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3062 (class 0 OID 0)
-- Dependencies: 255
-- Name: modelos_id_seq; Type: SEQUENCE OWNED BY; Schema: inventario; Owner: -
--

ALTER SEQUENCE modelos_id_seq OWNED BY modelos.id;


--
-- TOC entry 256 (class 1259 OID 48461)
-- Name: productos; Type: TABLE; Schema: inventario; Owner: -; Tablespace: 
--

CREATE TABLE productos (
    id integer NOT NULL,
    nombre_corto character varying(50) NOT NULL,
    vendible boolean NOT NULL,
    comprable boolean NOT NULL,
    precio real NOT NULL,
    costo real,
    estado_descriptivo integer NOT NULL,
    categoria integer NOT NULL,
    garantia integer NOT NULL,
    marca integer NOT NULL,
    modelo integer NOT NULL,
    ubicacion integer NOT NULL,
    cantidad integer NOT NULL,
    descripcion character varying(500) NOT NULL,
    codigo_baras character varying(15),
    tipo_consumo integer NOT NULL,
    bodega integer
);


--
-- TOC entry 257 (class 1259 OID 48467)
-- Name: productos_id_seq; Type: SEQUENCE; Schema: inventario; Owner: -
--

CREATE SEQUENCE productos_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3063 (class 0 OID 0)
-- Dependencies: 257
-- Name: productos_id_seq; Type: SEQUENCE OWNED BY; Schema: inventario; Owner: -
--

ALTER SEQUENCE productos_id_seq OWNED BY productos.id;


--
-- TOC entry 258 (class 1259 OID 48469)
-- Name: productos_impuestos; Type: TABLE; Schema: inventario; Owner: -; Tablespace: 
--

CREATE TABLE productos_impuestos (
    id integer NOT NULL,
    producto integer NOT NULL,
    impuesto integer NOT NULL
);


--
-- TOC entry 259 (class 1259 OID 48472)
-- Name: productos_impuestos_id_seq; Type: SEQUENCE; Schema: inventario; Owner: -
--

CREATE SEQUENCE productos_impuestos_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3064 (class 0 OID 0)
-- Dependencies: 259
-- Name: productos_impuestos_id_seq; Type: SEQUENCE OWNED BY; Schema: inventario; Owner: -
--

ALTER SEQUENCE productos_impuestos_id_seq OWNED BY productos_impuestos.id;


--
-- TOC entry 260 (class 1259 OID 48474)
-- Name: proveedores; Type: TABLE; Schema: inventario; Owner: -; Tablespace: 
--

CREATE TABLE proveedores (
    id integer NOT NULL,
    nombre character varying(250) NOT NULL,
    ruc character varying(15) NOT NULL,
    direccion character varying(250) NOT NULL,
    id_empresa integer NOT NULL
);


--
-- TOC entry 3065 (class 0 OID 0)
-- Dependencies: 260
-- Name: COLUMN proveedores.id_empresa; Type: COMMENT; Schema: inventario; Owner: -
--

COMMENT ON COLUMN proveedores.id_empresa IS 'conenta el probedor con los datos de su empresa';


--
-- TOC entry 261 (class 1259 OID 48480)
-- Name: proveedores_id_seq; Type: SEQUENCE; Schema: inventario; Owner: -
--

CREATE SEQUENCE proveedores_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3066 (class 0 OID 0)
-- Dependencies: 261
-- Name: proveedores_id_seq; Type: SEQUENCE OWNED BY; Schema: inventario; Owner: -
--

ALTER SEQUENCE proveedores_id_seq OWNED BY proveedores.id;


--
-- TOC entry 262 (class 1259 OID 48482)
-- Name: tipo_consumo; Type: TABLE; Schema: inventario; Owner: -; Tablespace: 
--

CREATE TABLE tipo_consumo (
    id integer NOT NULL,
    nombre character varying(50) NOT NULL,
    descripcion character varying(2000) NOT NULL,
    estado character varying(5) NOT NULL,
    fecha timestamp with time zone DEFAULT now() NOT NULL
);


--
-- TOC entry 263 (class 1259 OID 48489)
-- Name: tipo_consumo_id_seq; Type: SEQUENCE; Schema: inventario; Owner: -
--

CREATE SEQUENCE tipo_consumo_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3067 (class 0 OID 0)
-- Dependencies: 263
-- Name: tipo_consumo_id_seq; Type: SEQUENCE OWNED BY; Schema: inventario; Owner: -
--

ALTER SEQUENCE tipo_consumo_id_seq OWNED BY tipo_consumo.id;


--
-- TOC entry 264 (class 1259 OID 48491)
-- Name: tipos_catalogos; Type: TABLE; Schema: inventario; Owner: -; Tablespace: 
--

CREATE TABLE tipos_catalogos (
    id integer NOT NULL,
    nombre character varying(250) NOT NULL,
    descripcion character varying(2000) NOT NULL,
    fecha_inicio timestamp with time zone NOT NULL,
    fecha_fin timestamp with time zone NOT NULL,
    estado character varying(5) NOT NULL,
    fecha timestamp with time zone DEFAULT now() NOT NULL
);


--
-- TOC entry 265 (class 1259 OID 48498)
-- Name: tipos_catalogos_id_seq; Type: SEQUENCE; Schema: inventario; Owner: -
--

CREATE SEQUENCE tipos_catalogos_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3068 (class 0 OID 0)
-- Dependencies: 265
-- Name: tipos_catalogos_id_seq; Type: SEQUENCE OWNED BY; Schema: inventario; Owner: -
--

ALTER SEQUENCE tipos_catalogos_id_seq OWNED BY tipos_catalogos.id;


--
-- TOC entry 266 (class 1259 OID 48500)
-- Name: tipos_categorias; Type: TABLE; Schema: inventario; Owner: -; Tablespace: 
--

CREATE TABLE tipos_categorias (
    id integer NOT NULL,
    nombre character varying(50) NOT NULL,
    descripcion character varying(2000) NOT NULL,
    estado character varying(5) NOT NULL,
    fecha timestamp with time zone DEFAULT now()
);


--
-- TOC entry 267 (class 1259 OID 48507)
-- Name: tipos_categorias_id_seq; Type: SEQUENCE; Schema: inventario; Owner: -
--

CREATE SEQUENCE tipos_categorias_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3069 (class 0 OID 0)
-- Dependencies: 267
-- Name: tipos_categorias_id_seq; Type: SEQUENCE OWNED BY; Schema: inventario; Owner: -
--

ALTER SEQUENCE tipos_categorias_id_seq OWNED BY tipos_categorias.id;


--
-- TOC entry 268 (class 1259 OID 48509)
-- Name: tipos_garantias; Type: TABLE; Schema: inventario; Owner: -; Tablespace: 
--

CREATE TABLE tipos_garantias (
    id integer NOT NULL,
    nombre character varying(250) NOT NULL,
    descripcion character varying(2000),
    fecha timestamp with time zone DEFAULT now() NOT NULL,
    estado character varying(5)
);


--
-- TOC entry 3070 (class 0 OID 0)
-- Dependencies: 268
-- Name: COLUMN tipos_garantias.id; Type: COMMENT; Schema: inventario; Owner: -
--

COMMENT ON COLUMN tipos_garantias.id IS 'identificador';


--
-- TOC entry 3071 (class 0 OID 0)
-- Dependencies: 268
-- Name: COLUMN tipos_garantias.fecha; Type: COMMENT; Schema: inventario; Owner: -
--

COMMENT ON COLUMN tipos_garantias.fecha IS 'fechade creacion del tipo de garantia';


--
-- TOC entry 3072 (class 0 OID 0)
-- Dependencies: 268
-- Name: COLUMN tipos_garantias.estado; Type: COMMENT; Schema: inventario; Owner: -
--

COMMENT ON COLUMN tipos_garantias.estado IS 'define el estado del tipo de garantia';


--
-- TOC entry 269 (class 1259 OID 48516)
-- Name: tipos_garantias_id_seq; Type: SEQUENCE; Schema: inventario; Owner: -
--

CREATE SEQUENCE tipos_garantias_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3073 (class 0 OID 0)
-- Dependencies: 269
-- Name: tipos_garantias_id_seq; Type: SEQUENCE OWNED BY; Schema: inventario; Owner: -
--

ALTER SEQUENCE tipos_garantias_id_seq OWNED BY tipos_garantias.id;


--
-- TOC entry 270 (class 1259 OID 48518)
-- Name: tipos_imagenes_productos; Type: TABLE; Schema: inventario; Owner: -; Tablespace: 
--

CREATE TABLE tipos_imagenes_productos (
    id integer NOT NULL,
    nombre character varying(250) NOT NULL,
    estado character varying(5) NOT NULL,
    fecha timestamp with time zone DEFAULT now() NOT NULL
);


--
-- TOC entry 3074 (class 0 OID 0)
-- Dependencies: 270
-- Name: TABLE tipos_imagenes_productos; Type: COMMENT; Schema: inventario; Owner: -
--

COMMENT ON TABLE tipos_imagenes_productos IS 'contiene las direccioenes de las imagenes ';


--
-- TOC entry 3075 (class 0 OID 0)
-- Dependencies: 270
-- Name: COLUMN tipos_imagenes_productos.id; Type: COMMENT; Schema: inventario; Owner: -
--

COMMENT ON COLUMN tipos_imagenes_productos.id IS 'identificador de clave primaria';


--
-- TOC entry 3076 (class 0 OID 0)
-- Dependencies: 270
-- Name: COLUMN tipos_imagenes_productos.nombre; Type: COMMENT; Schema: inventario; Owner: -
--

COMMENT ON COLUMN tipos_imagenes_productos.nombre IS 'nombre del tipo de imagen';


--
-- TOC entry 3077 (class 0 OID 0)
-- Dependencies: 270
-- Name: COLUMN tipos_imagenes_productos.estado; Type: COMMENT; Schema: inventario; Owner: -
--

COMMENT ON COLUMN tipos_imagenes_productos.estado IS 'define si esta activo o no le tipo de imagen';


--
-- TOC entry 271 (class 1259 OID 48522)
-- Name: tipos_imagenes_productos_id_seq; Type: SEQUENCE; Schema: inventario; Owner: -
--

CREATE SEQUENCE tipos_imagenes_productos_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3078 (class 0 OID 0)
-- Dependencies: 271
-- Name: tipos_imagenes_productos_id_seq; Type: SEQUENCE OWNED BY; Schema: inventario; Owner: -
--

ALTER SEQUENCE tipos_imagenes_productos_id_seq OWNED BY tipos_imagenes_productos.id;


--
-- TOC entry 272 (class 1259 OID 48524)
-- Name: tipos_productos; Type: TABLE; Schema: inventario; Owner: -; Tablespace: 
--

CREATE TABLE tipos_productos (
    id integer NOT NULL,
    nombre character varying(250) NOT NULL,
    descripcion character varying(2000) NOT NULL,
    estado character varying(5) NOT NULL,
    fecha timestamp with time zone DEFAULT now() NOT NULL
);


--
-- TOC entry 273 (class 1259 OID 48531)
-- Name: tipos_productos_id_seq; Type: SEQUENCE; Schema: inventario; Owner: -
--

CREATE SEQUENCE tipos_productos_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3079 (class 0 OID 0)
-- Dependencies: 273
-- Name: tipos_productos_id_seq; Type: SEQUENCE OWNED BY; Schema: inventario; Owner: -
--

ALTER SEQUENCE tipos_productos_id_seq OWNED BY tipos_productos.id;


--
-- TOC entry 274 (class 1259 OID 48533)
-- Name: tipos_tipo_consumo; Type: TABLE; Schema: inventario; Owner: -; Tablespace: 
--

CREATE TABLE tipos_tipo_consumo (
    id integer NOT NULL,
    nombre character varying(50) NOT NULL,
    descripcion character varying(2000) NOT NULL,
    estado character varying(5) NOT NULL,
    fecha time with time zone DEFAULT now() NOT NULL
);


--
-- TOC entry 275 (class 1259 OID 48540)
-- Name: tipos_tipo_consumo_id_seq; Type: SEQUENCE; Schema: inventario; Owner: -
--

CREATE SEQUENCE tipos_tipo_consumo_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3080 (class 0 OID 0)
-- Dependencies: 275
-- Name: tipos_tipo_consumo_id_seq; Type: SEQUENCE OWNED BY; Schema: inventario; Owner: -
--

ALTER SEQUENCE tipos_tipo_consumo_id_seq OWNED BY tipos_tipo_consumo.id;


--
-- TOC entry 276 (class 1259 OID 48542)
-- Name: ubicaciones; Type: TABLE; Schema: inventario; Owner: -; Tablespace: 
--

CREATE TABLE ubicaciones (
    id integer NOT NULL,
    nombre character varying(250) NOT NULL,
    descripcion character varying(2000) NOT NULL,
    id_padre integer DEFAULT 0 NOT NULL,
    estado character varying(5) NOT NULL,
    fecha timestamp with time zone DEFAULT now() NOT NULL
);


--
-- TOC entry 277 (class 1259 OID 48550)
-- Name: ubicaciones_id_seq; Type: SEQUENCE; Schema: inventario; Owner: -
--

CREATE SEQUENCE ubicaciones_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3081 (class 0 OID 0)
-- Dependencies: 277
-- Name: ubicaciones_id_seq; Type: SEQUENCE OWNED BY; Schema: inventario; Owner: -
--

ALTER SEQUENCE ubicaciones_id_seq OWNED BY ubicaciones.id;


SET search_path = public, pg_catalog;

--
-- TOC entry 278 (class 1259 OID 48552)
-- Name: estados; Type: TABLE; Schema: public; Owner: -; Tablespace: 
--

CREATE TABLE estados (
    id character varying(5) NOT NULL,
    nombre character varying(50) NOT NULL,
    descripcion character varying(250) NOT NULL,
    fecha date DEFAULT now() NOT NULL
);


--
-- TOC entry 3082 (class 0 OID 0)
-- Dependencies: 278
-- Name: COLUMN estados.id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN estados.id IS 'define el identificados';


--
-- TOC entry 3083 (class 0 OID 0)
-- Dependencies: 278
-- Name: COLUMN estados.nombre; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN estados.nombre IS 'define nombre corto del estado';


--
-- TOC entry 279 (class 1259 OID 48556)
-- Name: operadoras_telefonicas; Type: TABLE; Schema: public; Owner: -; Tablespace: 
--

CREATE TABLE operadoras_telefonicas (
    id integer NOT NULL,
    nombre character varying(50) NOT NULL,
    descripcion character varying(500) NOT NULL,
    estado character varying(5) NOT NULL,
    fecha time with time zone DEFAULT now() NOT NULL
);


--
-- TOC entry 280 (class 1259 OID 48563)
-- Name: operadoras_telefonicas_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE operadoras_telefonicas_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3084 (class 0 OID 0)
-- Dependencies: 280
-- Name: operadoras_telefonicas_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE operadoras_telefonicas_id_seq OWNED BY operadoras_telefonicas.id;


--
-- TOC entry 281 (class 1259 OID 48565)
-- Name: personas; Type: TABLE; Schema: public; Owner: -; Tablespace: 
--

CREATE TABLE personas (
    id integer NOT NULL,
    primer_nombre character varying(50) NOT NULL,
    segundo_nombre character varying(50),
    primer_apellido character varying(50) NOT NULL,
    segundo_apellido character varying(50),
    id_localidad character varying(15) NOT NULL,
    calle character varying(500) NOT NULL,
    transversal character varying(500),
    numero character varying(25)
);


--
-- TOC entry 282 (class 1259 OID 48571)
-- Name: personas_correo_electronico; Type: TABLE; Schema: public; Owner: -; Tablespace: 
--

CREATE TABLE personas_correo_electronico (
    id integer NOT NULL,
    id_persona integer NOT NULL,
    correo_electronico character varying(250) NOT NULL,
    estado character varying(5) NOT NULL,
    fecha timestamp with time zone DEFAULT now() NOT NULL
);


--
-- TOC entry 283 (class 1259 OID 48575)
-- Name: personas_correo_electronico_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE personas_correo_electronico_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3085 (class 0 OID 0)
-- Dependencies: 283
-- Name: personas_correo_electronico_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE personas_correo_electronico_id_seq OWNED BY personas_correo_electronico.id;


--
-- TOC entry 284 (class 1259 OID 48577)
-- Name: personas_documentos_identificacion; Type: TABLE; Schema: public; Owner: -; Tablespace: 
--

CREATE TABLE personas_documentos_identificacion (
    id integer NOT NULL,
    id_persona integer NOT NULL,
    id_tipo_documento integer NOT NULL,
    numero_identificacion character varying(50) NOT NULL,
    estado character varying(5) NOT NULL,
    fecha time with time zone DEFAULT now() NOT NULL
);


--
-- TOC entry 285 (class 1259 OID 48581)
-- Name: personas_documentos_identificacion_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE personas_documentos_identificacion_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3086 (class 0 OID 0)
-- Dependencies: 285
-- Name: personas_documentos_identificacion_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE personas_documentos_identificacion_id_seq OWNED BY personas_documentos_identificacion.id;


--
-- TOC entry 286 (class 1259 OID 48583)
-- Name: personas_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE personas_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3087 (class 0 OID 0)
-- Dependencies: 286
-- Name: personas_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE personas_id_seq OWNED BY personas.id;


--
-- TOC entry 287 (class 1259 OID 48585)
-- Name: telefonos_personas; Type: TABLE; Schema: public; Owner: -; Tablespace: 
--

CREATE TABLE telefonos_personas (
    id integer NOT NULL,
    id_persona integer NOT NULL,
    numero character varying(25) NOT NULL,
    fecha timestamp with time zone DEFAULT now() NOT NULL,
    estado character varying(5) NOT NULL,
    id_operadora_telefonica integer NOT NULL
);


--
-- TOC entry 288 (class 1259 OID 48589)
-- Name: telefonos_personas_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE telefonos_personas_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3088 (class 0 OID 0)
-- Dependencies: 288
-- Name: telefonos_personas_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE telefonos_personas_id_seq OWNED BY telefonos_personas.id;


--
-- TOC entry 289 (class 1259 OID 48591)
-- Name: tipo_documento_identificacion; Type: TABLE; Schema: public; Owner: -; Tablespace: 
--

CREATE TABLE tipo_documento_identificacion (
    id integer NOT NULL,
    nombre character varying(75) NOT NULL,
    descripcion character varying(2000) NOT NULL,
    estado character varying(5) NOT NULL,
    fecha time with time zone DEFAULT now() NOT NULL
);


--
-- TOC entry 290 (class 1259 OID 48598)
-- Name: tipo_documento_identificaion_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE tipo_documento_identificaion_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3089 (class 0 OID 0)
-- Dependencies: 290
-- Name: tipo_documento_identificaion_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE tipo_documento_identificaion_id_seq OWNED BY tipo_documento_identificacion.id;


--
-- TOC entry 291 (class 1259 OID 48600)
-- Name: view_categorias; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW view_categorias AS
    WITH RECURSIVE path(nombre, descripcion, path, parent, id, tipo_categoria, id_padre, estado, fecha) AS (SELECT categorias.nombre, categorias.descripcion, '/'::text AS text, NULL::text AS text, categorias.id, categorias.tipo_categoria, categorias.id_padre, categorias.estado, categorias.fecha FROM inventario.categorias WHERE ((categorias.id_padre)::text = '0'::text) UNION SELECT categorias.nombre, categorias.descripcion, ((parentpath.path || CASE parentpath.path WHEN '/'::text THEN ''::text ELSE '/'::text END) || (categorias.nombre)::text), parentpath.path, categorias.id, categorias.tipo_categoria, categorias.id_padre, categorias.estado, categorias.fecha FROM inventario.categorias, path parentpath WHERE ((categorias.id_padre)::text = (parentpath.id)::text)) SELECT path.nombre, path.descripcion, path.path, path.parent, path.id, path.tipo_categoria, path.id_padre, path.estado, path.fecha FROM path;


--
-- TOC entry 3090 (class 0 OID 0)
-- Dependencies: 291
-- Name: VIEW view_categorias; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON VIEW view_categorias IS 'crea la vista categorias, definida como arbol';


SET search_path = ventas, pg_catalog;

--
-- TOC entry 292 (class 1259 OID 48605)
-- Name: formas_pago; Type: TABLE; Schema: ventas; Owner: -; Tablespace: 
--

CREATE TABLE formas_pago (
    id integer NOT NULL,
    nombre character varying(50) NOT NULL,
    codigo_sri character varying(5),
    descripcion character varying(500),
    estado character varying(5) NOT NULL,
    fecha date DEFAULT now() NOT NULL,
    id_padre integer
);


SET search_path = public, pg_catalog;

--
-- TOC entry 293 (class 1259 OID 48612)
-- Name: view_formas_pago; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW view_formas_pago AS
    WITH RECURSIVE path(nombre, descripcion, path, parent, id, codigo_sri, id_padre, estado, fecha) AS (SELECT formas_pago.nombre, formas_pago.descripcion, '/'::text AS text, NULL::text AS text, formas_pago.id, formas_pago.codigo_sri, formas_pago.id_padre, formas_pago.estado, formas_pago.fecha FROM ventas.formas_pago WHERE ((formas_pago.id_padre)::text = '0'::text) UNION SELECT formas_pago.nombre, formas_pago.descripcion, ((parentpath.path || CASE parentpath.path WHEN '/'::text THEN ''::text ELSE '/'::text END) || (formas_pago.nombre)::text), parentpath.path, formas_pago.id, formas_pago.codigo_sri, formas_pago.id_padre, formas_pago.estado, formas_pago.fecha FROM ventas.formas_pago, path parentpath WHERE ((formas_pago.id_padre)::text = (parentpath.id)::text)) SELECT path.nombre, path.descripcion, path.path, path.parent, path.id, path.codigo_sri, path.id_padre, path.estado, path.fecha FROM path;


--
-- TOC entry 3091 (class 0 OID 0)
-- Dependencies: 293
-- Name: VIEW view_formas_pago; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON VIEW view_formas_pago IS 'crea la vista formas de pago, definida como arbol';


--
-- TOC entry 294 (class 1259 OID 48617)
-- Name: view_ubicaciones; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW view_ubicaciones AS
    WITH RECURSIVE path(nombre, descripcion, path, parent, id, id_padre, estado, fecha) AS (SELECT ubicaciones.nombre, ubicaciones.descripcion, '/'::text AS text, NULL::text AS text, ubicaciones.id, ubicaciones.id_padre, ubicaciones.estado, ubicaciones.fecha FROM inventario.ubicaciones WHERE ((ubicaciones.id_padre)::text = '0'::text) UNION SELECT ubicaciones.nombre, ubicaciones.descripcion, ((parentpath.path || CASE parentpath.path WHEN '/'::text THEN ''::text ELSE '/'::text END) || (ubicaciones.nombre)::text), parentpath.path, ubicaciones.id, ubicaciones.id_padre, ubicaciones.estado, ubicaciones.fecha FROM inventario.ubicaciones, path parentpath WHERE ((ubicaciones.id_padre)::text = (parentpath.id)::text)) SELECT path.nombre, path.descripcion, path.path, path.parent, path.id, path.id_padre, path.estado, path.fecha FROM path;


--
-- TOC entry 3092 (class 0 OID 0)
-- Dependencies: 294
-- Name: VIEW view_ubicaciones; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON VIEW view_ubicaciones IS 'crea la vista ubicaciones, definida como arbol';


SET search_path = talento_humano, pg_catalog;

--
-- TOC entry 295 (class 1259 OID 48622)
-- Name: cargos; Type: TABLE; Schema: talento_humano; Owner: -; Tablespace: 
--

CREATE TABLE cargos (
    id integer NOT NULL,
    nombre character varying(150) NOT NULL,
    estado character varying(5) NOT NULL,
    fecha timestamp without time zone DEFAULT now() NOT NULL,
    id_padre integer
);


--
-- TOC entry 296 (class 1259 OID 48626)
-- Name: cargos_id_seq; Type: SEQUENCE; Schema: talento_humano; Owner: -
--

CREATE SEQUENCE cargos_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3093 (class 0 OID 0)
-- Dependencies: 296
-- Name: cargos_id_seq; Type: SEQUENCE OWNED BY; Schema: talento_humano; Owner: -
--

ALTER SEQUENCE cargos_id_seq OWNED BY cargos.id;


--
-- TOC entry 297 (class 1259 OID 48628)
-- Name: empleados; Type: TABLE; Schema: talento_humano; Owner: -; Tablespace: 
--

CREATE TABLE empleados (
    id integer NOT NULL,
    id_persona integer NOT NULL,
    estado character varying(5) NOT NULL,
    fecha timestamp with time zone DEFAULT now() NOT NULL,
    id_usuario character varying(75),
    id_cargo integer
);


--
-- TOC entry 298 (class 1259 OID 48632)
-- Name: empleados_id_seq; Type: SEQUENCE; Schema: talento_humano; Owner: -
--

CREATE SEQUENCE empleados_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3094 (class 0 OID 0)
-- Dependencies: 298
-- Name: empleados_id_seq; Type: SEQUENCE OWNED BY; Schema: talento_humano; Owner: -
--

ALTER SEQUENCE empleados_id_seq OWNED BY empleados.id;


--
-- TOC entry 299 (class 1259 OID 48634)
-- Name: empleados_personas; Type: VIEW; Schema: talento_humano; Owner: -
--

CREATE VIEW empleados_personas AS
    SELECT empleados.id_persona, empleados.id AS id_empleados, personas_documentos_identificacion.numero_identificacion, personas.primer_nombre, personas.segundo_nombre, personas.primer_apellido, personas.segundo_apellido, personas_correo_electronico.correo_electronico FROM public.personas, public.personas_correo_electronico, public.personas_documentos_identificacion, empleados WHERE ((empleados.id_persona = personas.id) AND (personas_documentos_identificacion.id_persona = empleados.id_persona));


--
-- TOC entry 300 (class 1259 OID 48638)
-- Name: jornadas_de_trabajo; Type: TABLE; Schema: talento_humano; Owner: -; Tablespace: 
--

CREATE TABLE jornadas_de_trabajo (
    id integer NOT NULL,
    nombre character varying(75) NOT NULL,
    descripcion character varying(2000) NOT NULL,
    porsentaje_cobro real NOT NULL,
    hora_inicio timestamp without time zone NOT NULL,
    hora_fin timestamp without time zone NOT NULL,
    hora_descanso integer NOT NULL
);


--
-- TOC entry 3095 (class 0 OID 0)
-- Dependencies: 300
-- Name: COLUMN jornadas_de_trabajo.hora_descanso; Type: COMMENT; Schema: talento_humano; Owner: -
--

COMMENT ON COLUMN jornadas_de_trabajo.hora_descanso IS 'ingresar el dato en minutos';


--
-- TOC entry 301 (class 1259 OID 48644)
-- Name: jornadas_de_trabajo_id_seq; Type: SEQUENCE; Schema: talento_humano; Owner: -
--

CREATE SEQUENCE jornadas_de_trabajo_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3096 (class 0 OID 0)
-- Dependencies: 301
-- Name: jornadas_de_trabajo_id_seq; Type: SEQUENCE OWNED BY; Schema: talento_humano; Owner: -
--

ALTER SEQUENCE jornadas_de_trabajo_id_seq OWNED BY jornadas_de_trabajo.id;


--
-- TOC entry 302 (class 1259 OID 48646)
-- Name: tipos_contratos; Type: TABLE; Schema: talento_humano; Owner: -; Tablespace: 
--

CREATE TABLE tipos_contratos (
    id integer NOT NULL,
    nombre character varying(75) NOT NULL,
    descripcion character varying(2000) NOT NULL,
    estado character varying(5) NOT NULL,
    fecha timestamp with time zone DEFAULT now() NOT NULL
);


--
-- TOC entry 303 (class 1259 OID 48653)
-- Name: tipos_contratos_id_seq; Type: SEQUENCE; Schema: talento_humano; Owner: -
--

CREATE SEQUENCE tipos_contratos_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3097 (class 0 OID 0)
-- Dependencies: 303
-- Name: tipos_contratos_id_seq; Type: SEQUENCE OWNED BY; Schema: talento_humano; Owner: -
--

ALTER SEQUENCE tipos_contratos_id_seq OWNED BY tipos_contratos.id;


SET search_path = usuarios, pg_catalog;

--
-- TOC entry 304 (class 1259 OID 48655)
-- Name: tipo_usuario; Type: TABLE; Schema: usuarios; Owner: -; Tablespace: 
--

CREATE TABLE tipo_usuario (
    id integer NOT NULL,
    nombre character varying(75) NOT NULL,
    descripcion character varying(500) NOT NULL,
    estado character varying(5) NOT NULL,
    fecha time with time zone DEFAULT now() NOT NULL
);


--
-- TOC entry 305 (class 1259 OID 48662)
-- Name: tipo_usuario_id_seq; Type: SEQUENCE; Schema: usuarios; Owner: -
--

CREATE SEQUENCE tipo_usuario_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3098 (class 0 OID 0)
-- Dependencies: 305
-- Name: tipo_usuario_id_seq; Type: SEQUENCE OWNED BY; Schema: usuarios; Owner: -
--

ALTER SEQUENCE tipo_usuario_id_seq OWNED BY tipo_usuario.id;


--
-- TOC entry 306 (class 1259 OID 48664)
-- Name: usuarios; Type: TABLE; Schema: usuarios; Owner: -; Tablespace: 
--

CREATE TABLE usuarios (
    id character varying(75) NOT NULL,
    nick character varying(50),
    clave_clave character varying(75),
    id_estado character varying(5),
    fecha_creacion timestamp with time zone,
    estado_clave boolean DEFAULT true NOT NULL,
    id_tipo_usuario integer NOT NULL
);


--
-- TOC entry 3099 (class 0 OID 0)
-- Dependencies: 306
-- Name: COLUMN usuarios.id; Type: COMMENT; Schema: usuarios; Owner: -
--

COMMENT ON COLUMN usuarios.id IS 'id usuario del sistema Nexbook';


--
-- TOC entry 3100 (class 0 OID 0)
-- Dependencies: 306
-- Name: COLUMN usuarios.clave_clave; Type: COMMENT; Schema: usuarios; Owner: -
--

COMMENT ON COLUMN usuarios.clave_clave IS 'define la clave del usuario';


--
-- TOC entry 3101 (class 0 OID 0)
-- Dependencies: 306
-- Name: COLUMN usuarios.id_estado; Type: COMMENT; Schema: usuarios; Owner: -
--

COMMENT ON COLUMN usuarios.id_estado IS 'estado del usuario';


--
-- TOC entry 3102 (class 0 OID 0)
-- Dependencies: 306
-- Name: COLUMN usuarios.fecha_creacion; Type: COMMENT; Schema: usuarios; Owner: -
--

COMMENT ON COLUMN usuarios.fecha_creacion IS 'fecha en la que fue creado el usuario';


SET search_path = ventas, pg_catalog;

--
-- TOC entry 307 (class 1259 OID 48668)
-- Name: caja; Type: TABLE; Schema: ventas; Owner: -; Tablespace: 
--

CREATE TABLE caja (
    id integer NOT NULL,
    nombre character varying(75) NOT NULL,
    id_sucursal integer NOT NULL,
    inicio_numero_factura integer NOT NULL,
    numero_fin_factura integer NOT NULL,
    estado character varying(5) NOT NULL,
    fecha date DEFAULT now() NOT NULL
);


--
-- TOC entry 308 (class 1259 OID 48672)
-- Name: caja_id_seq; Type: SEQUENCE; Schema: ventas; Owner: -
--

CREATE SEQUENCE caja_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3103 (class 0 OID 0)
-- Dependencies: 308
-- Name: caja_id_seq; Type: SEQUENCE OWNED BY; Schema: ventas; Owner: -
--

ALTER SEQUENCE caja_id_seq OWNED BY caja.id;


--
-- TOC entry 309 (class 1259 OID 48674)
-- Name: caja_usuario; Type: TABLE; Schema: ventas; Owner: -; Tablespace: 
--

CREATE TABLE caja_usuario (
    id_caja integer NOT NULL,
    id_usuario character varying(75) NOT NULL,
    id_empleado integer NOT NULL,
    estado character varying(5) NOT NULL,
    fecha date DEFAULT now() NOT NULL
);


--
-- TOC entry 310 (class 1259 OID 48678)
-- Name: clave_factura; Type: TABLE; Schema: ventas; Owner: -; Tablespace: 
--

CREATE TABLE clave_factura (
    id integer NOT NULL,
    id_factura integer NOT NULL,
    clave_factura character varying(49) NOT NULL,
    estado character varying(5) NOT NULL,
    fecha timestamp without time zone DEFAULT now() NOT NULL
);


--
-- TOC entry 311 (class 1259 OID 48682)
-- Name: clave_factura_id_seq; Type: SEQUENCE; Schema: ventas; Owner: -
--

CREATE SEQUENCE clave_factura_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3104 (class 0 OID 0)
-- Dependencies: 311
-- Name: clave_factura_id_seq; Type: SEQUENCE OWNED BY; Schema: ventas; Owner: -
--

ALTER SEQUENCE clave_factura_id_seq OWNED BY clave_factura.id;


--
-- TOC entry 312 (class 1259 OID 48684)
-- Name: detalle_factura; Type: TABLE; Schema: ventas; Owner: -; Tablespace: 
--

CREATE TABLE detalle_factura (
    id integer NOT NULL,
    id_factura integer NOT NULL,
    id_producto integer NOT NULL,
    precio_venta real NOT NULL,
    cantidad integer NOT NULL,
    descuento real,
    subtotal_item real NOT NULL
);


--
-- TOC entry 313 (class 1259 OID 48687)
-- Name: detalle_factura_id_seq; Type: SEQUENCE; Schema: ventas; Owner: -
--

CREATE SEQUENCE detalle_factura_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3105 (class 0 OID 0)
-- Dependencies: 313
-- Name: detalle_factura_id_seq; Type: SEQUENCE OWNED BY; Schema: ventas; Owner: -
--

ALTER SEQUENCE detalle_factura_id_seq OWNED BY detalle_factura.id;


--
-- TOC entry 314 (class 1259 OID 48689)
-- Name: empleado_factura; Type: TABLE; Schema: ventas; Owner: -; Tablespace: 
--

CREATE TABLE empleado_factura (
    id_empleado integer NOT NULL,
    id_factura integer NOT NULL,
    fecha date DEFAULT now() NOT NULL
);


--
-- TOC entry 315 (class 1259 OID 48693)
-- Name: facturas; Type: TABLE; Schema: ventas; Owner: -; Tablespace: 
--

CREATE TABLE facturas (
    id integer NOT NULL,
    numero_factura character varying(10) NOT NULL,
    numero_autorizacion integer NOT NULL,
    ruc_emisor character varying(15) NOT NULL,
    denominacion character varying(15) DEFAULT 'FACTURA'::character varying NOT NULL,
    direccion_matriz character varying(250) NOT NULL,
    direccion_sucursal character varying(250),
    fecha_autorizacion timestamp with time zone NOT NULL,
    fecha_emicion timestamp with time zone NOT NULL,
    guia_remision character varying(15),
    fecha_caducidad_factura timestamp with time zone NOT NULL,
    datos_imprenta character varying(500),
    subtotal_iva real NOT NULL,
    subtotal_sin_iva real NOT NULL,
    descuentos real NOT NULL,
    valor_iva real NOT NULL,
    ice real NOT NULL,
    total real NOT NULL,
    estado character varying(5) NOT NULL,
    id_cliente character(50)[]
);


--
-- TOC entry 316 (class 1259 OID 48700)
-- Name: facturas_id_seq; Type: SEQUENCE; Schema: ventas; Owner: -
--

CREATE SEQUENCE facturas_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3106 (class 0 OID 0)
-- Dependencies: 316
-- Name: facturas_id_seq; Type: SEQUENCE OWNED BY; Schema: ventas; Owner: -
--

ALTER SEQUENCE facturas_id_seq OWNED BY facturas.id;


--
-- TOC entry 317 (class 1259 OID 48702)
-- Name: formas_pago_facturas; Type: TABLE; Schema: ventas; Owner: -; Tablespace: 
--

CREATE TABLE formas_pago_facturas (
    id integer NOT NULL,
    id_factura integer NOT NULL,
    id_formas_pago integer NOT NULL
);


--
-- TOC entry 318 (class 1259 OID 48705)
-- Name: formas_pago_facturas_id_seq; Type: SEQUENCE; Schema: ventas; Owner: -
--

CREATE SEQUENCE formas_pago_facturas_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3107 (class 0 OID 0)
-- Dependencies: 318
-- Name: formas_pago_facturas_id_seq; Type: SEQUENCE OWNED BY; Schema: ventas; Owner: -
--

ALTER SEQUENCE formas_pago_facturas_id_seq OWNED BY formas_pago_facturas.id;


--
-- TOC entry 319 (class 1259 OID 48707)
-- Name: formas_pago_id_seq; Type: SEQUENCE; Schema: ventas; Owner: -
--

CREATE SEQUENCE formas_pago_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3108 (class 0 OID 0)
-- Dependencies: 319
-- Name: formas_pago_id_seq; Type: SEQUENCE OWNED BY; Schema: ventas; Owner: -
--

ALTER SEQUENCE formas_pago_id_seq OWNED BY formas_pago.id;


--
-- TOC entry 320 (class 1259 OID 48709)
-- Name: producto_descuento; Type: TABLE; Schema: ventas; Owner: -; Tablespace: 
--

CREATE TABLE producto_descuento (
    id integer NOT NULL,
    id_producto integer NOT NULL,
    id_catalogo integer NOT NULL,
    estado character varying(5) NOT NULL,
    fecha_fin_descuento timestamp with time zone NOT NULL,
    fecha_inicio_descuento timestamp with time zone NOT NULL
);


--
-- TOC entry 321 (class 1259 OID 48712)
-- Name: producto_descuento_id_seq; Type: SEQUENCE; Schema: ventas; Owner: -
--

CREATE SEQUENCE producto_descuento_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3109 (class 0 OID 0)
-- Dependencies: 321
-- Name: producto_descuento_id_seq; Type: SEQUENCE OWNED BY; Schema: ventas; Owner: -
--

ALTER SEQUENCE producto_descuento_id_seq OWNED BY producto_descuento.id;


SET search_path = administracion, pg_catalog;

--
-- TOC entry 2309 (class 2604 OID 49427)
-- Name: id; Type: DEFAULT; Schema: administracion; Owner: -
--

ALTER TABLE ONLY actividad_economica ALTER COLUMN id SET DEFAULT nextval('actividad_economica_id_seq'::regclass);


--
-- TOC entry 2313 (class 2604 OID 49428)
-- Name: id; Type: DEFAULT; Schema: administracion; Owner: -
--

ALTER TABLE ONLY empresas ALTER COLUMN id SET DEFAULT nextval('empresas_id_seq'::regclass);


--
-- TOC entry 2315 (class 2604 OID 49429)
-- Name: id; Type: DEFAULT; Schema: administracion; Owner: -
--

ALTER TABLE ONLY imagen_empresa ALTER COLUMN id SET DEFAULT nextval('imagen_empresa_id_seq'::regclass);


--
-- TOC entry 2317 (class 2604 OID 49430)
-- Name: id; Type: DEFAULT; Schema: administracion; Owner: -
--

ALTER TABLE ONLY tipo_accion_vista ALTER COLUMN id SET DEFAULT nextval('tipo_accion_vista_id_seq'::regclass);


--
-- TOC entry 2319 (class 2604 OID 49431)
-- Name: id; Type: DEFAULT; Schema: administracion; Owner: -
--

ALTER TABLE ONLY tipo_bienes_servicios ALTER COLUMN id SET DEFAULT nextval('tipo_bienes_servicios_id_seq'::regclass);


--
-- TOC entry 2321 (class 2604 OID 49432)
-- Name: id; Type: DEFAULT; Schema: administracion; Owner: -
--

ALTER TABLE ONLY tipo_empresa ALTER COLUMN id SET DEFAULT nextval('tipo_empresa_id_seq'::regclass);


--
-- TOC entry 2323 (class 2604 OID 49433)
-- Name: id; Type: DEFAULT; Schema: administracion; Owner: -
--

ALTER TABLE ONLY tipos_imagenes_empresas ALTER COLUMN id SET DEFAULT nextval('tipos_imagenes_productos_id_seq'::regclass);


--
-- TOC entry 2325 (class 2604 OID 49434)
-- Name: id; Type: DEFAULT; Schema: administracion; Owner: -
--

ALTER TABLE ONLY usuarios_privilegios ALTER COLUMN id SET DEFAULT nextval('usuarios_privilegios_id_seq'::regclass);


--
-- TOC entry 2328 (class 2604 OID 49435)
-- Name: id; Type: DEFAULT; Schema: administracion; Owner: -
--

ALTER TABLE ONLY vistas ALTER COLUMN id SET DEFAULT nextval('vistas_id_seq'::regclass);


SET search_path = auditoria, pg_catalog;

--
-- TOC entry 2329 (class 2604 OID 49436)
-- Name: id; Type: DEFAULT; Schema: auditoria; Owner: -
--

ALTER TABLE ONLY auditoria ALTER COLUMN id SET DEFAULT nextval('auditoria_id_seq'::regclass);


--
-- TOC entry 2331 (class 2604 OID 49437)
-- Name: id; Type: DEFAULT; Schema: auditoria; Owner: -
--

ALTER TABLE ONLY ingresos_usuarios ALTER COLUMN id SET DEFAULT nextval('ingresos_usuarios_id_seq'::regclass);


SET search_path = contabilidad, pg_catalog;

--
-- TOC entry 2336 (class 2604 OID 49438)
-- Name: id; Type: DEFAULT; Schema: contabilidad; Owner: -
--

ALTER TABLE ONLY ambitos_impuestos ALTER COLUMN id SET DEFAULT nextval('ambitos_impuestos_id_seq'::regclass);


--
-- TOC entry 2338 (class 2604 OID 49439)
-- Name: id; Type: DEFAULT; Schema: contabilidad; Owner: -
--

ALTER TABLE ONLY asientos_contables_diario ALTER COLUMN id SET DEFAULT nextval('asientos_contables_diario_id_seq'::regclass);


--
-- TOC entry 2340 (class 2604 OID 49440)
-- Name: id; Type: DEFAULT; Schema: contabilidad; Owner: -
--

ALTER TABLE ONLY bancos ALTER COLUMN id SET DEFAULT nextval('bancos_id_seq'::regclass);


--
-- TOC entry 2342 (class 2604 OID 49441)
-- Name: id; Type: DEFAULT; Schema: contabilidad; Owner: -
--

ALTER TABLE ONLY cuentas_contables ALTER COLUMN id SET DEFAULT nextval('cuentas_contables_id_seq'::regclass);


--
-- TOC entry 2346 (class 2604 OID 49442)
-- Name: id; Type: DEFAULT; Schema: contabilidad; Owner: -
--

ALTER TABLE ONLY finaciaminto ALTER COLUMN id SET DEFAULT nextval('finaciaminto_id_seq'::regclass);


--
-- TOC entry 2348 (class 2604 OID 49443)
-- Name: id; Type: DEFAULT; Schema: contabilidad; Owner: -
--

ALTER TABLE ONLY gasto_mes_repositorio ALTER COLUMN id SET DEFAULT nextval('gasto_mes_repositorio_id_seq'::regclass);


--
-- TOC entry 2350 (class 2604 OID 49444)
-- Name: id; Type: DEFAULT; Schema: contabilidad; Owner: -
--

ALTER TABLE ONLY gastos_impuestos_renta_deduccion ALTER COLUMN id SET DEFAULT nextval('gastos_impuestos_renta_deduccion_id_seq'::regclass);


--
-- TOC entry 2351 (class 2604 OID 49445)
-- Name: id; Type: DEFAULT; Schema: contabilidad; Owner: -
--

ALTER TABLE ONLY grupo_impuestos ALTER COLUMN id SET DEFAULT nextval('grupo_impuestos_id_seq'::regclass);


--
-- TOC entry 2354 (class 2604 OID 49446)
-- Name: id; Type: DEFAULT; Schema: contabilidad; Owner: -
--

ALTER TABLE ONLY impuestos ALTER COLUMN id SET DEFAULT nextval('impuestos_id_seq'::regclass);


--
-- TOC entry 2334 (class 2604 OID 49447)
-- Name: id; Type: DEFAULT; Schema: contabilidad; Owner: -
--

ALTER TABLE ONLY plazos_credito ALTER COLUMN id SET DEFAULT nextval('"Plazos_credito_id_seq"'::regclass);


--
-- TOC entry 2356 (class 2604 OID 49448)
-- Name: id_factura; Type: DEFAULT; Schema: contabilidad; Owner: -
--

ALTER TABLE ONLY repositorio_facturas ALTER COLUMN id_factura SET DEFAULT nextval('repositorio_facturas_id_factura_seq'::regclass);


--
-- TOC entry 2344 (class 2604 OID 49449)
-- Name: id; Type: DEFAULT; Schema: contabilidad; Owner: -
--

ALTER TABLE ONLY repositorio_facturas_correo ALTER COLUMN id SET DEFAULT nextval('facturas_correo_id_seq'::regclass);


--
-- TOC entry 2358 (class 2604 OID 49450)
-- Name: id_factura_r; Type: DEFAULT; Schema: contabilidad; Owner: -
--

ALTER TABLE ONLY repositorio_facturas_rechazadas ALTER COLUMN id_factura_r SET DEFAULT nextval('repositorio_facturas_rechazadas_id_factura_r_seq'::regclass);


--
-- TOC entry 2360 (class 2604 OID 49451)
-- Name: id; Type: DEFAULT; Schema: contabilidad; Owner: -
--

ALTER TABLE ONLY rol_pagos_empleados ALTER COLUMN id SET DEFAULT nextval('rol_pagos_empleados_id_seq'::regclass);


--
-- TOC entry 2365 (class 2604 OID 49452)
-- Name: id; Type: DEFAULT; Schema: contabilidad; Owner: -
--

ALTER TABLE ONLY tipo_impuestos ALTER COLUMN id SET DEFAULT nextval('tipo_impuestos_id_seq'::regclass);


--
-- TOC entry 2362 (class 2604 OID 49453)
-- Name: id; Type: DEFAULT; Schema: contabilidad; Owner: -
--

ALTER TABLE ONLY tipos_cuentas_contables ALTER COLUMN id SET DEFAULT nextval('tipo_cuenta_contable_id_seq'::regclass);


--
-- TOC entry 2367 (class 2604 OID 49454)
-- Name: id; Type: DEFAULT; Schema: contabilidad; Owner: -
--

ALTER TABLE ONLY tipos_gastos_personales ALTER COLUMN id SET DEFAULT nextval('tipos_gastos_personales_id_seq'::regclass);


SET search_path = inventario, pg_catalog;

--
-- TOC entry 2369 (class 2604 OID 49455)
-- Name: id; Type: DEFAULT; Schema: inventario; Owner: -
--

ALTER TABLE ONLY bodegas ALTER COLUMN id SET DEFAULT nextval('bodegas_id_seq'::regclass);


--
-- TOC entry 2370 (class 2604 OID 49456)
-- Name: id; Type: DEFAULT; Schema: inventario; Owner: -
--

ALTER TABLE ONLY catalogos ALTER COLUMN id SET DEFAULT nextval('catalogos_id_seq'::regclass);


--
-- TOC entry 2373 (class 2604 OID 49457)
-- Name: id; Type: DEFAULT; Schema: inventario; Owner: -
--

ALTER TABLE ONLY categorias ALTER COLUMN id SET DEFAULT nextval('categorias_id_seq'::regclass);


--
-- TOC entry 2374 (class 2604 OID 49458)
-- Name: id; Type: DEFAULT; Schema: inventario; Owner: -
--

ALTER TABLE ONLY descripcion_producto ALTER COLUMN id SET DEFAULT nextval('descripcion_producto_id_seq'::regclass);


--
-- TOC entry 2376 (class 2604 OID 49459)
-- Name: id; Type: DEFAULT; Schema: inventario; Owner: -
--

ALTER TABLE ONLY estado_descriptivo ALTER COLUMN id SET DEFAULT nextval('estado_descriptivo_id_seq'::regclass);


--
-- TOC entry 2378 (class 2604 OID 49460)
-- Name: id; Type: DEFAULT; Schema: inventario; Owner: -
--

ALTER TABLE ONLY garantias ALTER COLUMN id SET DEFAULT nextval('garantias_id_seq'::regclass);


--
-- TOC entry 2381 (class 2604 OID 49461)
-- Name: id; Type: DEFAULT; Schema: inventario; Owner: -
--

ALTER TABLE ONLY manejo_presios ALTER COLUMN id SET DEFAULT nextval('manejo_presios_id_seq'::regclass);


--
-- TOC entry 2383 (class 2604 OID 49462)
-- Name: id; Type: DEFAULT; Schema: inventario; Owner: -
--

ALTER TABLE ONLY marcas ALTER COLUMN id SET DEFAULT nextval('marcas_id_seq'::regclass);


--
-- TOC entry 2385 (class 2604 OID 49463)
-- Name: id; Type: DEFAULT; Schema: inventario; Owner: -
--

ALTER TABLE ONLY modelos ALTER COLUMN id SET DEFAULT nextval('modelos_id_seq'::regclass);


--
-- TOC entry 2386 (class 2604 OID 49464)
-- Name: id; Type: DEFAULT; Schema: inventario; Owner: -
--

ALTER TABLE ONLY productos ALTER COLUMN id SET DEFAULT nextval('productos_id_seq'::regclass);


--
-- TOC entry 2387 (class 2604 OID 49465)
-- Name: id; Type: DEFAULT; Schema: inventario; Owner: -
--

ALTER TABLE ONLY productos_impuestos ALTER COLUMN id SET DEFAULT nextval('productos_impuestos_id_seq'::regclass);


--
-- TOC entry 2388 (class 2604 OID 49466)
-- Name: id; Type: DEFAULT; Schema: inventario; Owner: -
--

ALTER TABLE ONLY proveedores ALTER COLUMN id SET DEFAULT nextval('proveedores_id_seq'::regclass);


--
-- TOC entry 2390 (class 2604 OID 49467)
-- Name: id; Type: DEFAULT; Schema: inventario; Owner: -
--

ALTER TABLE ONLY tipo_consumo ALTER COLUMN id SET DEFAULT nextval('tipo_consumo_id_seq'::regclass);


--
-- TOC entry 2392 (class 2604 OID 49468)
-- Name: id; Type: DEFAULT; Schema: inventario; Owner: -
--

ALTER TABLE ONLY tipos_catalogos ALTER COLUMN id SET DEFAULT nextval('tipos_catalogos_id_seq'::regclass);


--
-- TOC entry 2394 (class 2604 OID 49469)
-- Name: id; Type: DEFAULT; Schema: inventario; Owner: -
--

ALTER TABLE ONLY tipos_categorias ALTER COLUMN id SET DEFAULT nextval('tipos_categorias_id_seq'::regclass);


--
-- TOC entry 2396 (class 2604 OID 49470)
-- Name: id; Type: DEFAULT; Schema: inventario; Owner: -
--

ALTER TABLE ONLY tipos_garantias ALTER COLUMN id SET DEFAULT nextval('tipos_garantias_id_seq'::regclass);


--
-- TOC entry 2398 (class 2604 OID 49471)
-- Name: id; Type: DEFAULT; Schema: inventario; Owner: -
--

ALTER TABLE ONLY tipos_imagenes_productos ALTER COLUMN id SET DEFAULT nextval('tipos_imagenes_productos_id_seq'::regclass);


--
-- TOC entry 2400 (class 2604 OID 49472)
-- Name: id; Type: DEFAULT; Schema: inventario; Owner: -
--

ALTER TABLE ONLY tipos_productos ALTER COLUMN id SET DEFAULT nextval('tipos_productos_id_seq'::regclass);


--
-- TOC entry 2402 (class 2604 OID 49473)
-- Name: id; Type: DEFAULT; Schema: inventario; Owner: -
--

ALTER TABLE ONLY tipos_tipo_consumo ALTER COLUMN id SET DEFAULT nextval('tipos_tipo_consumo_id_seq'::regclass);


--
-- TOC entry 2405 (class 2604 OID 49474)
-- Name: id; Type: DEFAULT; Schema: inventario; Owner: -
--

ALTER TABLE ONLY ubicaciones ALTER COLUMN id SET DEFAULT nextval('ubicaciones_id_seq'::regclass);


SET search_path = public, pg_catalog;

--
-- TOC entry 2408 (class 2604 OID 49475)
-- Name: id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY operadoras_telefonicas ALTER COLUMN id SET DEFAULT nextval('operadoras_telefonicas_id_seq'::regclass);


--
-- TOC entry 2409 (class 2604 OID 49476)
-- Name: id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY personas ALTER COLUMN id SET DEFAULT nextval('personas_id_seq'::regclass);


--
-- TOC entry 2411 (class 2604 OID 49477)
-- Name: id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY personas_correo_electronico ALTER COLUMN id SET DEFAULT nextval('personas_correo_electronico_id_seq'::regclass);


--
-- TOC entry 2413 (class 2604 OID 49478)
-- Name: id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY personas_documentos_identificacion ALTER COLUMN id SET DEFAULT nextval('personas_documentos_identificacion_id_seq'::regclass);


--
-- TOC entry 2415 (class 2604 OID 49479)
-- Name: id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY telefonos_personas ALTER COLUMN id SET DEFAULT nextval('telefonos_personas_id_seq'::regclass);


--
-- TOC entry 2417 (class 2604 OID 49480)
-- Name: id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY tipo_documento_identificacion ALTER COLUMN id SET DEFAULT nextval('tipo_documento_identificaion_id_seq'::regclass);


SET search_path = talento_humano, pg_catalog;

--
-- TOC entry 2421 (class 2604 OID 49481)
-- Name: id; Type: DEFAULT; Schema: talento_humano; Owner: -
--

ALTER TABLE ONLY cargos ALTER COLUMN id SET DEFAULT nextval('cargos_id_seq'::regclass);


--
-- TOC entry 2423 (class 2604 OID 49482)
-- Name: id; Type: DEFAULT; Schema: talento_humano; Owner: -
--

ALTER TABLE ONLY empleados ALTER COLUMN id SET DEFAULT nextval('empleados_id_seq'::regclass);


--
-- TOC entry 2424 (class 2604 OID 49483)
-- Name: id; Type: DEFAULT; Schema: talento_humano; Owner: -
--

ALTER TABLE ONLY jornadas_de_trabajo ALTER COLUMN id SET DEFAULT nextval('jornadas_de_trabajo_id_seq'::regclass);


--
-- TOC entry 2426 (class 2604 OID 49484)
-- Name: id; Type: DEFAULT; Schema: talento_humano; Owner: -
--

ALTER TABLE ONLY tipos_contratos ALTER COLUMN id SET DEFAULT nextval('tipos_contratos_id_seq'::regclass);


SET search_path = usuarios, pg_catalog;

--
-- TOC entry 2428 (class 2604 OID 49485)
-- Name: id; Type: DEFAULT; Schema: usuarios; Owner: -
--

ALTER TABLE ONLY tipo_usuario ALTER COLUMN id SET DEFAULT nextval('tipo_usuario_id_seq'::regclass);


SET search_path = ventas, pg_catalog;

--
-- TOC entry 2431 (class 2604 OID 49486)
-- Name: id; Type: DEFAULT; Schema: ventas; Owner: -
--

ALTER TABLE ONLY caja ALTER COLUMN id SET DEFAULT nextval('caja_id_seq'::regclass);


--
-- TOC entry 2434 (class 2604 OID 49487)
-- Name: id; Type: DEFAULT; Schema: ventas; Owner: -
--

ALTER TABLE ONLY clave_factura ALTER COLUMN id SET DEFAULT nextval('clave_factura_id_seq'::regclass);


--
-- TOC entry 2435 (class 2604 OID 49488)
-- Name: id; Type: DEFAULT; Schema: ventas; Owner: -
--

ALTER TABLE ONLY detalle_factura ALTER COLUMN id SET DEFAULT nextval('detalle_factura_id_seq'::regclass);


--
-- TOC entry 2438 (class 2604 OID 49489)
-- Name: id; Type: DEFAULT; Schema: ventas; Owner: -
--

ALTER TABLE ONLY facturas ALTER COLUMN id SET DEFAULT nextval('facturas_id_seq'::regclass);


--
-- TOC entry 2419 (class 2604 OID 49490)
-- Name: id; Type: DEFAULT; Schema: ventas; Owner: -
--

ALTER TABLE ONLY formas_pago ALTER COLUMN id SET DEFAULT nextval('formas_pago_id_seq'::regclass);


--
-- TOC entry 2439 (class 2604 OID 49491)
-- Name: id; Type: DEFAULT; Schema: ventas; Owner: -
--

ALTER TABLE ONLY formas_pago_facturas ALTER COLUMN id SET DEFAULT nextval('formas_pago_facturas_id_seq'::regclass);


--
-- TOC entry 2440 (class 2604 OID 49492)
-- Name: id; Type: DEFAULT; Schema: ventas; Owner: -
--

ALTER TABLE ONLY producto_descuento ALTER COLUMN id SET DEFAULT nextval('producto_descuento_id_seq'::regclass);


SET search_path = administracion, pg_catalog;

--
-- TOC entry 2854 (class 0 OID 48143)
-- Dependencies: 176
-- Data for Name: actividad_economica; Type: TABLE DATA; Schema: administracion; Owner: -
--

COPY actividad_economica (id, nombre, descripcion, id_tipo_bienes_servicios, estado, fecha, imagen) FROM stdin;
\.


--
-- TOC entry 3110 (class 0 OID 0)
-- Dependencies: 177
-- Name: actividad_economica_id_seq; Type: SEQUENCE SET; Schema: administracion; Owner: -
--

SELECT pg_catalog.setval('actividad_economica_id_seq', 1, false);


--
-- TOC entry 2856 (class 0 OID 48152)
-- Dependencies: 178
-- Data for Name: clientes; Type: TABLE DATA; Schema: administracion; Owner: -
--

COPY clientes (id, tipo_cliente, id_cliente, id_tipo_documento, fecha, estado) FROM stdin;
\.


--
-- TOC entry 2857 (class 0 OID 48159)
-- Dependencies: 179
-- Data for Name: empresas; Type: TABLE DATA; Schema: administracion; Owner: -
--

COPY empresas (id, razon_social, actividad_economica, ruc_ci, nombre_comercial, tipo_persona, id_estado, fecha, tipo_empresa) FROM stdin;
\.


--
-- TOC entry 3111 (class 0 OID 0)
-- Dependencies: 180
-- Name: empresas_id_seq; Type: SEQUENCE SET; Schema: administracion; Owner: -
--

SELECT pg_catalog.setval('empresas_id_seq', 1, false);


--
-- TOC entry 2859 (class 0 OID 48169)
-- Dependencies: 181
-- Data for Name: imagen_empresa; Type: TABLE DATA; Schema: administracion; Owner: -
--

COPY imagen_empresa (id, sucursal, direccion_imagen_empresa, direccion_imagen_recorte, estado, fecha, tipo_imagen) FROM stdin;
\.


--
-- TOC entry 3112 (class 0 OID 0)
-- Dependencies: 182
-- Name: imagen_empresa_id_seq; Type: SEQUENCE SET; Schema: administracion; Owner: -
--

SELECT pg_catalog.setval('imagen_empresa_id_seq', 1, false);


--
-- TOC entry 3113 (class 0 OID 0)
-- Dependencies: 183
-- Name: sucursales_id_seq; Type: SEQUENCE SET; Schema: administracion; Owner: -
--

SELECT pg_catalog.setval('sucursales_id_seq', 1, false);


--
-- TOC entry 2862 (class 0 OID 48180)
-- Dependencies: 184
-- Data for Name: tipo_accion_vista; Type: TABLE DATA; Schema: administracion; Owner: -
--

COPY tipo_accion_vista (id, accion_ver, accion_guardar, accion_modificar, estado, fecha) FROM stdin;
\.


--
-- TOC entry 3114 (class 0 OID 0)
-- Dependencies: 185
-- Name: tipo_accion_vista_id_seq; Type: SEQUENCE SET; Schema: administracion; Owner: -
--

SELECT pg_catalog.setval('tipo_accion_vista_id_seq', 1, false);


--
-- TOC entry 2864 (class 0 OID 48186)
-- Dependencies: 186
-- Data for Name: tipo_bienes_servicios; Type: TABLE DATA; Schema: administracion; Owner: -
--

COPY tipo_bienes_servicios (id, nombre, descripcion, fecha, estado, id_prestacion) FROM stdin;
0	Falta definir	solicita definir tipo de giro de negocio	2017-03-21 15:53:16.112294	A	\N
\.


--
-- TOC entry 3115 (class 0 OID 0)
-- Dependencies: 187
-- Name: tipo_bienes_servicios_id_seq; Type: SEQUENCE SET; Schema: administracion; Owner: -
--

SELECT pg_catalog.setval('tipo_bienes_servicios_id_seq', 6, true);


--
-- TOC entry 2866 (class 0 OID 48195)
-- Dependencies: 188
-- Data for Name: tipo_empresa; Type: TABLE DATA; Schema: administracion; Owner: -
--

COPY tipo_empresa (id, nombre, descripcion, estado, fecha) FROM stdin;
0	Propia                                            	la empresa propietaria de la BDD	A	2017-04-17 15:05:22.37072
1	Cliente                                           	empresa cliente	A	2017-04-17 15:05:41.539454
\.


--
-- TOC entry 3116 (class 0 OID 0)
-- Dependencies: 189
-- Name: tipo_empresa_id_seq; Type: SEQUENCE SET; Schema: administracion; Owner: -
--

SELECT pg_catalog.setval('tipo_empresa_id_seq', 3, true);


--
-- TOC entry 2868 (class 0 OID 48204)
-- Dependencies: 190
-- Data for Name: tipos_imagenes_empresas; Type: TABLE DATA; Schema: administracion; Owner: -
--

COPY tipos_imagenes_empresas (id, nombre, estado, fecha) FROM stdin;
1	PORTADA	A	2017-05-18 10:25:13.384762-05
2	PERFIL	A	2017-05-18 10:25:29.059976-05
3	FRONTAL	A	2017-05-18 10:25:40.058242-05
0	PENDIENTE	A	2017-05-18 10:25:50.510283-05
\.


--
-- TOC entry 3117 (class 0 OID 0)
-- Dependencies: 191
-- Name: tipos_imagenes_productos_id_seq; Type: SEQUENCE SET; Schema: administracion; Owner: -
--

SELECT pg_catalog.setval('tipos_imagenes_productos_id_seq', 3, true);


--
-- TOC entry 2870 (class 0 OID 48210)
-- Dependencies: 192
-- Data for Name: usuarios_privilegios; Type: TABLE DATA; Schema: administracion; Owner: -
--

COPY usuarios_privilegios (id, estado, fecha, id_vista, id_tipo_usuario, id_tipo_accion_vistas) FROM stdin;
\.


--
-- TOC entry 3118 (class 0 OID 0)
-- Dependencies: 193
-- Name: usuarios_privilegios_id_seq; Type: SEQUENCE SET; Schema: administracion; Owner: -
--

SELECT pg_catalog.setval('usuarios_privilegios_id_seq', 1, false);


--
-- TOC entry 2872 (class 0 OID 48216)
-- Dependencies: 194
-- Data for Name: vistas; Type: TABLE DATA; Schema: administracion; Owner: -
--

COPY vistas (id, nombre, path, url, personalizacion, estado, id_padre, nivel_arbol, template_, controller_, fecha) FROM stdin;
\.


--
-- TOC entry 3119 (class 0 OID 0)
-- Dependencies: 195
-- Name: vistas_id_seq; Type: SEQUENCE SET; Schema: administracion; Owner: -
--

SELECT pg_catalog.setval('vistas_id_seq', 1, false);


SET search_path = auditoria, pg_catalog;

--
-- TOC entry 2874 (class 0 OID 48226)
-- Dependencies: 196
-- Data for Name: auditoria; Type: TABLE DATA; Schema: auditoria; Owner: -
--

COPY auditoria (id, tabla_afectada, operacion, variable_anterior, variable_nueva, fecha, usuario) FROM stdin;
3	cargos                                       	U	(1,Administrador,,"2017-05-18 15:28:06.929823",)	(1,Administrador,A,"2017-05-18 15:28:06.929823",)	2017-05-18 15:28:39.964714	postgres                                     
4	cargos                                       	U	(1,Administrador,A,"2017-05-18 15:28:06.929823",)	(1,Administrador,A,"2017-05-18 15:28:06.929823",0)	2017-05-18 15:29:04.993192	postgres                                     
5	usuarios                                     	I	\N	("usuario prueba 1",prueba,123455,A,,t,1)	2017-06-05 12:45:38.91663	postgres                                     
6	empleados                                    	I	\N	(6,1,A,"2017-06-05 12:46:35.094297-05","usuario prueba 1",)	2017-06-05 12:46:35.094297	postgres                                     
7	empleados                                    	U	(6,1,A,"2017-06-05 12:46:35.094297-05","usuario prueba 1",)	(1,1,A,"2017-06-05 12:46:35.094297-05","usuario prueba 1",)	2017-06-05 12:46:52.813799	postgres                                     
\.


--
-- TOC entry 3120 (class 0 OID 0)
-- Dependencies: 197
-- Name: auditoria_id_seq; Type: SEQUENCE SET; Schema: auditoria; Owner: -
--

SELECT pg_catalog.setval('auditoria_id_seq', 7, true);


--
-- TOC entry 2876 (class 0 OID 48234)
-- Dependencies: 198
-- Data for Name: ingresos_usuarios; Type: TABLE DATA; Schema: auditoria; Owner: -
--

COPY ingresos_usuarios (id, usuario, informacion_servidor, fecha, ip_acceso) FROM stdin;
\.


--
-- TOC entry 3121 (class 0 OID 0)
-- Dependencies: 199
-- Name: ingresos_usuarios_id_seq; Type: SEQUENCE SET; Schema: auditoria; Owner: -
--

SELECT pg_catalog.setval('ingresos_usuarios_id_seq', 2, true);


SET search_path = contabilidad, pg_catalog;

--
-- TOC entry 3122 (class 0 OID 0)
-- Dependencies: 201
-- Name: Plazos_credito_id_seq; Type: SEQUENCE SET; Schema: contabilidad; Owner: -
--

SELECT pg_catalog.setval('"Plazos_credito_id_seq"', 1, false);


--
-- TOC entry 2880 (class 0 OID 48250)
-- Dependencies: 202
-- Data for Name: ambitos_impuestos; Type: TABLE DATA; Schema: contabilidad; Owner: -
--

COPY ambitos_impuestos (id, nombre, estado, fecha) FROM stdin;
4	VENTAS	A	2017-01-13
5	COMPRAS	A	2017-01-13
\.


--
-- TOC entry 3123 (class 0 OID 0)
-- Dependencies: 203
-- Name: ambitos_impuestos_id_seq; Type: SEQUENCE SET; Schema: contabilidad; Owner: -
--

SELECT pg_catalog.setval('ambitos_impuestos_id_seq', 5, true);


--
-- TOC entry 2882 (class 0 OID 48256)
-- Dependencies: 204
-- Data for Name: asientos_contables_diario; Type: TABLE DATA; Schema: contabilidad; Owner: -
--

COPY asientos_contables_diario (id, id_tipo_cuenta_contable, referencia_asiento, debe, haber, fecha, estado) FROM stdin;
\.


--
-- TOC entry 3124 (class 0 OID 0)
-- Dependencies: 205
-- Name: asientos_contables_diario_id_seq; Type: SEQUENCE SET; Schema: contabilidad; Owner: -
--

SELECT pg_catalog.setval('asientos_contables_diario_id_seq', 1, false);


--
-- TOC entry 2884 (class 0 OID 48262)
-- Dependencies: 206
-- Data for Name: bancos; Type: TABLE DATA; Schema: contabilidad; Owner: -
--

COPY bancos (id, nombre_banco, numero_cuanta, titular_cuenta, direccion_sucursal_banco, estado, fecha) FROM stdin;
\.


--
-- TOC entry 3125 (class 0 OID 0)
-- Dependencies: 207
-- Name: bancos_id_seq; Type: SEQUENCE SET; Schema: contabilidad; Owner: -
--

SELECT pg_catalog.setval('bancos_id_seq', 1, false);


--
-- TOC entry 2886 (class 0 OID 48271)
-- Dependencies: 208
-- Data for Name: cuentas_contables; Type: TABLE DATA; Schema: contabilidad; Owner: -
--

COPY cuentas_contables (id, codigo_contable, nombre_corto, descripcion, signo_cuenta, tipo_cuenta) FROM stdin;
1	10.01.011	EFECTIVO	Todos lo pagos realizados en efectivo	0	1
2	10.01.012	BANCOS	Todos los pagos echos a traves del sistema financiero	0	1
4	6.01.02	VESTIMENTA	Gastos de vestimenta	0	2
9	6.01.04	VIVIENDA	Gastos de vivienda	0	2
10	6.01.05	SALUD	Gastos de Salud	0	2
8	6.01.03	EDUCACION	Gastos de educacion	0	2
3	6.01.01	ALIMENTACION	Gastos de alimentacion	0	2
11	6.01.06	OTROS	Todos lo demas gastos no contenplados para deduccion	0	2
\.


--
-- TOC entry 3126 (class 0 OID 0)
-- Dependencies: 209
-- Name: cuentas_contables_id_seq; Type: SEQUENCE SET; Schema: contabilidad; Owner: -
--

SELECT pg_catalog.setval('cuentas_contables_id_seq', 11, true);


--
-- TOC entry 3127 (class 0 OID 0)
-- Dependencies: 211
-- Name: facturas_correo_id_seq; Type: SEQUENCE SET; Schema: contabilidad; Owner: -
--

SELECT pg_catalog.setval('facturas_correo_id_seq', 1, false);


--
-- TOC entry 2890 (class 0 OID 48289)
-- Dependencies: 212
-- Data for Name: fecha_declaracion_ruc; Type: TABLE DATA; Schema: contabilidad; Owner: -
--

COPY fecha_declaracion_ruc (noveno_dig, fecha_maxima_declaracion, numero_dias) FROM stdin;
1	10 del mes siguiente	10
2	12 del mes siguiente	12
3	14 del mes siguiente	14
4	16 del mes siguiente	16
5	18 del mes siguiente	18
6	20 del mes siguiente	20
7	22 del mes siguiente	22
8	24 del mes siguiente	24
9	26 del mes siguiente	26
0	28 del mes siguiente	28
\.


--
-- TOC entry 2891 (class 0 OID 48292)
-- Dependencies: 213
-- Data for Name: finaciaminto; Type: TABLE DATA; Schema: contabilidad; Owner: -
--

COPY finaciaminto (id, id_factura, total_factura, pago_parcial, numero_cuotas, id_plazos_credito, fecha_prestamo, subtotal_sin_iva, subtotal_iva, iva, fecha_vencimiento, estado_pago, porcentaje_sin_iva, porcentaje_iva, porcentaje_con_iva) FROM stdin;
\.


--
-- TOC entry 3128 (class 0 OID 0)
-- Dependencies: 214
-- Name: finaciaminto_id_seq; Type: SEQUENCE SET; Schema: contabilidad; Owner: -
--

SELECT pg_catalog.setval('finaciaminto_id_seq', 1, false);


--
-- TOC entry 2893 (class 0 OID 48298)
-- Dependencies: 215
-- Data for Name: gasto_mes_repositorio; Type: TABLE DATA; Schema: contabilidad; Owner: -
--

COPY gasto_mes_repositorio (id, id_factura, id_tipo_gasto, total_gasto, fecha, estado_revicion) FROM stdin;
\.


--
-- TOC entry 3129 (class 0 OID 0)
-- Dependencies: 216
-- Name: gasto_mes_repositorio_id_seq; Type: SEQUENCE SET; Schema: contabilidad; Owner: -
--

SELECT pg_catalog.setval('gasto_mes_repositorio_id_seq', 1, false);


--
-- TOC entry 2895 (class 0 OID 48304)
-- Dependencies: 217
-- Data for Name: gastos_impuestos_renta_deduccion; Type: TABLE DATA; Schema: contabilidad; Owner: -
--

COPY gastos_impuestos_renta_deduccion (id, id_factura, id_tipo_gasto_personal, valor_acumular, estado, fecha) FROM stdin;
\.


--
-- TOC entry 3130 (class 0 OID 0)
-- Dependencies: 218
-- Name: gastos_impuestos_renta_deduccion_id_seq; Type: SEQUENCE SET; Schema: contabilidad; Owner: -
--

SELECT pg_catalog.setval('gastos_impuestos_renta_deduccion_id_seq', 1, false);


--
-- TOC entry 2897 (class 0 OID 48310)
-- Dependencies: 219
-- Data for Name: genealogia_impuestos; Type: TABLE DATA; Schema: contabilidad; Owner: -
--

COPY genealogia_impuestos (id_impuesto_padre, id_impuesto_hijo) FROM stdin;
\.


--
-- TOC entry 2898 (class 0 OID 48313)
-- Dependencies: 220
-- Data for Name: grupo_impuestos; Type: TABLE DATA; Schema: contabilidad; Owner: -
--

COPY grupo_impuestos (id, nombre, estado, fecha) FROM stdin;
\.


--
-- TOC entry 3131 (class 0 OID 0)
-- Dependencies: 221
-- Name: grupo_impuestos_id_seq; Type: SEQUENCE SET; Schema: contabilidad; Owner: -
--

SELECT pg_catalog.setval('grupo_impuestos_id_seq', 1, false);


--
-- TOC entry 2900 (class 0 OID 48318)
-- Dependencies: 222
-- Data for Name: impuestos; Type: TABLE DATA; Schema: contabilidad; Owner: -
--

COPY impuestos (id, codigo_sri, nombre, descripcion, cantidad, estado, fecha, ambito, tipo_impuesto) FROM stdin;
4	2	Porcentaje IVA 12%	Porcentaje IVA 12%	12	A	2017-01-17	4	0
2	0	Porcentaje IVA 0%	Porcentaje IVA 0%	0	A	2017-01-17	4	0
6	3	Porcentaje IVA 14%	Porcentaje IVA 14%	14	A	2017-01-17	4	0
8	6	No Objeto de Impuesto	No Objeto de Impuesto	0	A	2017-01-17	4	0
9	7	Exento de IVA	Exento de IVA	0	A	2017-01-17	4	0
\.


--
-- TOC entry 3132 (class 0 OID 0)
-- Dependencies: 223
-- Name: impuestos_id_seq; Type: SEQUENCE SET; Schema: contabilidad; Owner: -
--

SELECT pg_catalog.setval('impuestos_id_seq', 9, true);


--
-- TOC entry 2878 (class 0 OID 48243)
-- Dependencies: 200
-- Data for Name: plazos_credito; Type: TABLE DATA; Schema: contabilidad; Owner: -
--

COPY plazos_credito (id, nombre, dias_credito, estado, fecha) FROM stdin;
\.


--
-- TOC entry 2902 (class 0 OID 48328)
-- Dependencies: 224
-- Data for Name: repositorio_facturas; Type: TABLE DATA; Schema: contabilidad; Owner: -
--

COPY repositorio_facturas (id_factura, num_factura, nombre_comercial, clave_acceso, ruc_prov, tipo_doc, total, contenido_fac, created_at, id_sucursal, fecha_emision, subtotal_12, subtotal_0, subtotal_no_sujeto, subtotal_exento_iva, subtotal_sin_impuestos, descuento, ice, iva_12, propina, estado, estado_view) FROM stdin;
\.


--
-- TOC entry 2888 (class 0 OID 48280)
-- Dependencies: 210
-- Data for Name: repositorio_facturas_correo; Type: TABLE DATA; Schema: contabilidad; Owner: -
--

COPY repositorio_facturas_correo (id, ruta_acceso, id_correo, estado_proceso_factura, emisor_factura, nombre_archivo, fecha, asunto) FROM stdin;
\.


--
-- TOC entry 3133 (class 0 OID 0)
-- Dependencies: 225
-- Name: repositorio_facturas_id_factura_seq; Type: SEQUENCE SET; Schema: contabilidad; Owner: -
--

SELECT pg_catalog.setval('repositorio_facturas_id_factura_seq', 1, false);


--
-- TOC entry 2904 (class 0 OID 48337)
-- Dependencies: 226
-- Data for Name: repositorio_facturas_rechazadas; Type: TABLE DATA; Schema: contabilidad; Owner: -
--

COPY repositorio_facturas_rechazadas (id_factura_r, clave_acceso, razon_rechazo, created_at, estado, contenido_correo, emisor_factura, asunto) FROM stdin;
\.


--
-- TOC entry 3134 (class 0 OID 0)
-- Dependencies: 227
-- Name: repositorio_facturas_rechazadas_id_factura_r_seq; Type: SEQUENCE SET; Schema: contabilidad; Owner: -
--

SELECT pg_catalog.setval('repositorio_facturas_rechazadas_id_factura_r_seq', 6, true);


--
-- TOC entry 2906 (class 0 OID 48346)
-- Dependencies: 228
-- Data for Name: rol_pagos_empleados; Type: TABLE DATA; Schema: contabilidad; Owner: -
--

COPY rol_pagos_empleados (id, id_empleado, mes_pago) FROM stdin;
3	1	6
4	1	6
\.


--
-- TOC entry 3135 (class 0 OID 0)
-- Dependencies: 229
-- Name: rol_pagos_empleados_id_seq; Type: SEQUENCE SET; Schema: contabilidad; Owner: -
--

SELECT pg_catalog.setval('rol_pagos_empleados_id_seq', 4, true);


--
-- TOC entry 3136 (class 0 OID 0)
-- Dependencies: 231
-- Name: tipo_cuenta_contable_id_seq; Type: SEQUENCE SET; Schema: contabilidad; Owner: -
--

SELECT pg_catalog.setval('tipo_cuenta_contable_id_seq', 2, true);


--
-- TOC entry 2910 (class 0 OID 48361)
-- Dependencies: 232
-- Data for Name: tipo_documentos; Type: TABLE DATA; Schema: contabilidad; Owner: -
--

COPY tipo_documentos (id, nombre, descripcion, estado, fecha) FROM stdin;
01	FACTURA	FACTURA	A	2017-01-17 15:12:08
04	NOTA DE CRÉDITO	NOTA DE CRÉDITO	A	2017-01-17 15:13:51
05	NOTA DE DÉBITO	NOTA DE DÉBITO	A	2017-01-17 15:15:28
06	GUÍA DE REMISIÓN	GUÍA DE REMISIÓN	A	2017-01-17 15:16:04
07	COMPROBANTE DE RETENCIÓN	COMPROBANTE DE RETENCIÓN	A	2017-01-17 15:16:28
\.


--
-- TOC entry 2911 (class 0 OID 48365)
-- Dependencies: 233
-- Data for Name: tipo_impuestos; Type: TABLE DATA; Schema: contabilidad; Owner: -
--

COPY tipo_impuestos (id, nombre, descripcion, estado, fecha) FROM stdin;
0	no definido	no definido	A	2017-04-12 17:32:55
1	IVA	Impuesto al valor Agregado	A	2017-04-17 17:20:30
2	ICE	Impuestos Consumos Especiales	A	2017-04-17 17:21:11
\.


--
-- TOC entry 3137 (class 0 OID 0)
-- Dependencies: 234
-- Name: tipo_impuestos_id_seq; Type: SEQUENCE SET; Schema: contabilidad; Owner: -
--

SELECT pg_catalog.setval('tipo_impuestos_id_seq', 1, false);


--
-- TOC entry 2908 (class 0 OID 48352)
-- Dependencies: 230
-- Data for Name: tipos_cuentas_contables; Type: TABLE DATA; Schema: contabilidad; Owner: -
--

COPY tipos_cuentas_contables (id, nombre, descripcion, estado, fecha) FROM stdin;
1	CUENTAS REALES	Se utilizan en el estado de situacion financiero	A	2017-01-20 11:50:11.866106
2	CUENTAS NOMINALES	Se utilizan para el estado de perdidas o ganancias	A	2017-01-20 11:51:08.976658
\.


--
-- TOC entry 2913 (class 0 OID 48371)
-- Dependencies: 235
-- Data for Name: tipos_gastos_personales; Type: TABLE DATA; Schema: contabilidad; Owner: -
--

COPY tipos_gastos_personales (id, nombre, descripcion, valor_maximo, estado, fecha) FROM stdin;
1	ALIMENTACION	Productos de alimetacion	3510	A	2017-04-05
2	VIVIENDA	Invercion e construccion	3510	A	2017-04-05
3	VESTIMENTA	Ropa y articulos de vestir	3510	A	2017-04-05
4	EDUCACION	Educacion	3510	A	2017-04-05
5	SALUD	Salud	3510	A	2017-04-05
6	OTROS	Todos los gasto no deducibles	10000000	A	2017-04-05
\.


--
-- TOC entry 3138 (class 0 OID 0)
-- Dependencies: 236
-- Name: tipos_gastos_personales_id_seq; Type: SEQUENCE SET; Schema: contabilidad; Owner: -
--

SELECT pg_catalog.setval('tipos_gastos_personales_id_seq', 1, false);


SET search_path = inventario, pg_catalog;

--
-- TOC entry 2915 (class 0 OID 48380)
-- Dependencies: 237
-- Data for Name: bodegas; Type: TABLE DATA; Schema: inventario; Owner: -
--

COPY bodegas (id, id_sucursal, nombre, calle, numero, especificaciones, fecha, estado, giro_negocio) FROM stdin;
\.


--
-- TOC entry 3139 (class 0 OID 0)
-- Dependencies: 238
-- Name: bodegas_id_seq; Type: SEQUENCE SET; Schema: inventario; Owner: -
--

SELECT pg_catalog.setval('bodegas_id_seq', 1, false);


--
-- TOC entry 2917 (class 0 OID 48389)
-- Dependencies: 239
-- Data for Name: catalogos; Type: TABLE DATA; Schema: inventario; Owner: -
--

COPY catalogos (id, tipo_catalogo, producto) FROM stdin;
\.


--
-- TOC entry 3140 (class 0 OID 0)
-- Dependencies: 240
-- Name: catalogos_id_seq; Type: SEQUENCE SET; Schema: inventario; Owner: -
--

SELECT pg_catalog.setval('catalogos_id_seq', 1, false);


--
-- TOC entry 2919 (class 0 OID 48394)
-- Dependencies: 241
-- Data for Name: categorias; Type: TABLE DATA; Schema: inventario; Owner: -
--

COPY categorias (id, nombre, descripcion, tipo_categoria, estado, fecha, id_padre) FROM stdin;
1	Sin Categoria	No tiene una categoria	1	A	2017-02-17 09:04:57.818015-05	0
\.


--
-- TOC entry 3141 (class 0 OID 0)
-- Dependencies: 242
-- Name: categorias_id_seq; Type: SEQUENCE SET; Schema: inventario; Owner: -
--

SELECT pg_catalog.setval('categorias_id_seq', 3, true);


--
-- TOC entry 2921 (class 0 OID 48404)
-- Dependencies: 243
-- Data for Name: descripcion_producto; Type: TABLE DATA; Schema: inventario; Owner: -
--

COPY descripcion_producto (id, producto, descripcion_corta, descripcion_proveedor, descripcion_proformas, descripcion_movi_inventa) FROM stdin;
\.


--
-- TOC entry 3142 (class 0 OID 0)
-- Dependencies: 244
-- Name: descripcion_producto_id_seq; Type: SEQUENCE SET; Schema: inventario; Owner: -
--

SELECT pg_catalog.setval('descripcion_producto_id_seq', 1, false);


--
-- TOC entry 2923 (class 0 OID 48412)
-- Dependencies: 245
-- Data for Name: estado_descriptivo; Type: TABLE DATA; Schema: inventario; Owner: -
--

COPY estado_descriptivo (id, nombre, descripcion, estado, fecha, id_padre) FROM stdin;
1	Productos	se aplican a productos	A	2017-04-26 10:52:56.572459-05	0
5	Baja	Producto que cumplieron su vida util	A	2017-04-03 14:58:11.388408-05	1
4	Defectuoso	Productos que stan defectuosos de fabrica	A	2017-04-03 14:56:14.175912-05	1
3	Usado	PRoductos o bienes nuevos	A	2017-04-03 14:55:39.280521-05	1
2	Nuevo	Productos o Bienes nuevos	A	2017-03-14 09:48:18.227251-05	1
\.


--
-- TOC entry 3143 (class 0 OID 0)
-- Dependencies: 246
-- Name: estado_descriptivo_id_seq; Type: SEQUENCE SET; Schema: inventario; Owner: -
--

SELECT pg_catalog.setval('estado_descriptivo_id_seq', 5, true);


--
-- TOC entry 2925 (class 0 OID 48421)
-- Dependencies: 247
-- Data for Name: garantias; Type: TABLE DATA; Schema: inventario; Owner: -
--

COPY garantias (id, nombre, descripcion, estado, fecha, tipo_garantia, duracion, id_padre) FROM stdin;
1	Sin garantia	No tiene garantia	A	2017-02-17 09:06:43.824581-05	1	0	0
\.


--
-- TOC entry 3144 (class 0 OID 0)
-- Dependencies: 248
-- Name: garantias_id_seq; Type: SEQUENCE SET; Schema: inventario; Owner: -
--

SELECT pg_catalog.setval('garantias_id_seq', 3, true);


--
-- TOC entry 2927 (class 0 OID 48430)
-- Dependencies: 249
-- Data for Name: imagenes_productos; Type: TABLE DATA; Schema: inventario; Owner: -
--

COPY imagenes_productos (id, nombre, direccion, tipo_imagen, estado, fecha, producto) FROM stdin;
\.


--
-- TOC entry 2928 (class 0 OID 48434)
-- Dependencies: 250
-- Data for Name: manejo_presios; Type: TABLE DATA; Schema: inventario; Owner: -
--

COPY manejo_presios (id, id_producto, nombre, valor_precio, estado, fecha) FROM stdin;
\.


--
-- TOC entry 3145 (class 0 OID 0)
-- Dependencies: 251
-- Name: manejo_presios_id_seq; Type: SEQUENCE SET; Schema: inventario; Owner: -
--

SELECT pg_catalog.setval('manejo_presios_id_seq', 1, false);


--
-- TOC entry 2930 (class 0 OID 48443)
-- Dependencies: 252
-- Data for Name: marcas; Type: TABLE DATA; Schema: inventario; Owner: -
--

COPY marcas (id, nombre, descripcion, estado, fecha, id_padre) FROM stdin;
1	Sin marca	No tiene marca	A	2017-02-17 09:07:23.375101-05	0
\.


--
-- TOC entry 3146 (class 0 OID 0)
-- Dependencies: 253
-- Name: marcas_id_seq; Type: SEQUENCE SET; Schema: inventario; Owner: -
--

SELECT pg_catalog.setval('marcas_id_seq', 1, true);


--
-- TOC entry 2932 (class 0 OID 48452)
-- Dependencies: 254
-- Data for Name: modelos; Type: TABLE DATA; Schema: inventario; Owner: -
--

COPY modelos (id, nombre, descripcion, estado, fecha, id_padre) FROM stdin;
1	Sin modelo	No posee un modelo	A	2017-02-17 09:07:59.498661-05	0
\.


--
-- TOC entry 3147 (class 0 OID 0)
-- Dependencies: 255
-- Name: modelos_id_seq; Type: SEQUENCE SET; Schema: inventario; Owner: -
--

SELECT pg_catalog.setval('modelos_id_seq', 1, true);


--
-- TOC entry 2934 (class 0 OID 48461)
-- Dependencies: 256
-- Data for Name: productos; Type: TABLE DATA; Schema: inventario; Owner: -
--

COPY productos (id, nombre_corto, vendible, comprable, precio, costo, estado_descriptivo, categoria, garantia, marca, modelo, ubicacion, cantidad, descripcion, codigo_baras, tipo_consumo, bodega) FROM stdin;
\.


--
-- TOC entry 3148 (class 0 OID 0)
-- Dependencies: 257
-- Name: productos_id_seq; Type: SEQUENCE SET; Schema: inventario; Owner: -
--

SELECT pg_catalog.setval('productos_id_seq', 1, false);


--
-- TOC entry 2936 (class 0 OID 48469)
-- Dependencies: 258
-- Data for Name: productos_impuestos; Type: TABLE DATA; Schema: inventario; Owner: -
--

COPY productos_impuestos (id, producto, impuesto) FROM stdin;
\.


--
-- TOC entry 3149 (class 0 OID 0)
-- Dependencies: 259
-- Name: productos_impuestos_id_seq; Type: SEQUENCE SET; Schema: inventario; Owner: -
--

SELECT pg_catalog.setval('productos_impuestos_id_seq', 1, false);


--
-- TOC entry 2938 (class 0 OID 48474)
-- Dependencies: 260
-- Data for Name: proveedores; Type: TABLE DATA; Schema: inventario; Owner: -
--

COPY proveedores (id, nombre, ruc, direccion, id_empresa) FROM stdin;
\.


--
-- TOC entry 3150 (class 0 OID 0)
-- Dependencies: 261
-- Name: proveedores_id_seq; Type: SEQUENCE SET; Schema: inventario; Owner: -
--

SELECT pg_catalog.setval('proveedores_id_seq', 1, false);


--
-- TOC entry 2940 (class 0 OID 48482)
-- Dependencies: 262
-- Data for Name: tipo_consumo; Type: TABLE DATA; Schema: inventario; Owner: -
--

COPY tipo_consumo (id, nombre, descripcion, estado, fecha) FROM stdin;
1	Alimentacion	Alimentacion	A	2017-02-07 17:05:40.277249-05
2	Educacion	Educacion	A	2017-02-07 17:05:58.117491-05
3	Salud	Salud	A	2017-02-13 09:40:10.462923-05
4	Vivienda	Vivienda	A	2017-02-13 09:53:39.446406-05
5	Vestimenta	Vestimenta	A	2017-02-13 09:54:26.286261-05
6	Otros	Los que no esten dentro de los tipos de consumo	A	2017-04-03 12:32:45.640883-05
\.


--
-- TOC entry 3151 (class 0 OID 0)
-- Dependencies: 263
-- Name: tipo_consumo_id_seq; Type: SEQUENCE SET; Schema: inventario; Owner: -
--

SELECT pg_catalog.setval('tipo_consumo_id_seq', 7, true);


--
-- TOC entry 2942 (class 0 OID 48491)
-- Dependencies: 264
-- Data for Name: tipos_catalogos; Type: TABLE DATA; Schema: inventario; Owner: -
--

COPY tipos_catalogos (id, nombre, descripcion, fecha_inicio, fecha_fin, estado, fecha) FROM stdin;
\.


--
-- TOC entry 3152 (class 0 OID 0)
-- Dependencies: 265
-- Name: tipos_catalogos_id_seq; Type: SEQUENCE SET; Schema: inventario; Owner: -
--

SELECT pg_catalog.setval('tipos_catalogos_id_seq', 1, false);


--
-- TOC entry 2944 (class 0 OID 48500)
-- Dependencies: 266
-- Data for Name: tipos_categorias; Type: TABLE DATA; Schema: inventario; Owner: -
--

COPY tipos_categorias (id, nombre, descripcion, estado, fecha) FROM stdin;
1	Sin Tipo Categoria	No posee un tipo de categoria	A	2017-02-17 09:04:46.562617-05
\.


--
-- TOC entry 3153 (class 0 OID 0)
-- Dependencies: 267
-- Name: tipos_categorias_id_seq; Type: SEQUENCE SET; Schema: inventario; Owner: -
--

SELECT pg_catalog.setval('tipos_categorias_id_seq', 3, true);


--
-- TOC entry 2946 (class 0 OID 48509)
-- Dependencies: 268
-- Data for Name: tipos_garantias; Type: TABLE DATA; Schema: inventario; Owner: -
--

COPY tipos_garantias (id, nombre, descripcion, fecha, estado) FROM stdin;
1	Sin tipo Garantitia	No posee un tipo de garantia	2017-02-17 09:05:42.688275-05	\N
\.


--
-- TOC entry 3154 (class 0 OID 0)
-- Dependencies: 269
-- Name: tipos_garantias_id_seq; Type: SEQUENCE SET; Schema: inventario; Owner: -
--

SELECT pg_catalog.setval('tipos_garantias_id_seq', 1, true);


--
-- TOC entry 2948 (class 0 OID 48518)
-- Dependencies: 270
-- Data for Name: tipos_imagenes_productos; Type: TABLE DATA; Schema: inventario; Owner: -
--

COPY tipos_imagenes_productos (id, nombre, estado, fecha) FROM stdin;
\.


--
-- TOC entry 3155 (class 0 OID 0)
-- Dependencies: 271
-- Name: tipos_imagenes_productos_id_seq; Type: SEQUENCE SET; Schema: inventario; Owner: -
--

SELECT pg_catalog.setval('tipos_imagenes_productos_id_seq', 1, false);


--
-- TOC entry 2950 (class 0 OID 48524)
-- Dependencies: 272
-- Data for Name: tipos_productos; Type: TABLE DATA; Schema: inventario; Owner: -
--

COPY tipos_productos (id, nombre, descripcion, estado, fecha) FROM stdin;
\.


--
-- TOC entry 3156 (class 0 OID 0)
-- Dependencies: 273
-- Name: tipos_productos_id_seq; Type: SEQUENCE SET; Schema: inventario; Owner: -
--

SELECT pg_catalog.setval('tipos_productos_id_seq', 1, false);


--
-- TOC entry 2952 (class 0 OID 48533)
-- Dependencies: 274
-- Data for Name: tipos_tipo_consumo; Type: TABLE DATA; Schema: inventario; Owner: -
--

COPY tipos_tipo_consumo (id, nombre, descripcion, estado, fecha) FROM stdin;
\.


--
-- TOC entry 3157 (class 0 OID 0)
-- Dependencies: 275
-- Name: tipos_tipo_consumo_id_seq; Type: SEQUENCE SET; Schema: inventario; Owner: -
--

SELECT pg_catalog.setval('tipos_tipo_consumo_id_seq', 1, false);


--
-- TOC entry 2954 (class 0 OID 48542)
-- Dependencies: 276
-- Data for Name: ubicaciones; Type: TABLE DATA; Schema: inventario; Owner: -
--

COPY ubicaciones (id, nombre, descripcion, id_padre, estado, fecha) FROM stdin;
1	Edificio Matriz	Sucursal Principal de la Empresa	0	A	2017-03-20 10:43:09.411446-05
\.


--
-- TOC entry 3158 (class 0 OID 0)
-- Dependencies: 277
-- Name: ubicaciones_id_seq; Type: SEQUENCE SET; Schema: inventario; Owner: -
--

SELECT pg_catalog.setval('ubicaciones_id_seq', 1, true);


SET search_path = public, pg_catalog;

--
-- TOC entry 2956 (class 0 OID 48552)
-- Dependencies: 278
-- Data for Name: estados; Type: TABLE DATA; Schema: public; Owner: -
--

COPY estados (id, nombre, descripcion, fecha) FROM stdin;
A	Activo	El item seleccionado puede ser usado	2017-03-16
I	Inactivo	El item seleccionado  no puede ser usado	2017-03-16
P	Pasivo	El item seleccionado necesita una activacion	2017-03-16
FA	Anulada	Factura Anulada	2017-04-24
FR	Rechasada	Factura rechasada	2017-04-24
FCC	Credito	Factura en credito de la factura	2017-04-24
FCV	Vencida	Factura credito vencido	2017-04-24
FCP	Cancelado	Factura cancelada o pagada en su totalidad	2017-04-24
\.


--
-- TOC entry 2957 (class 0 OID 48556)
-- Dependencies: 279
-- Data for Name: operadoras_telefonicas; Type: TABLE DATA; Schema: public; Owner: -
--

COPY operadoras_telefonicas (id, nombre, descripcion, estado, fecha) FROM stdin;
2	MOVISTAR	Operadora Celular	A	16:20:01.92526-05
1	CLARO	Operadora Celular	A	16:19:39.531288-05
3	CNT CELULAR	Operadora Celular	A	16:20:36.933809-05
4	CNT FIJO	Operadora Fijo	A	16:20:58.696937-05
\.


--
-- TOC entry 3159 (class 0 OID 0)
-- Dependencies: 280
-- Name: operadoras_telefonicas_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('operadoras_telefonicas_id_seq', 1, false);


--
-- TOC entry 2959 (class 0 OID 48565)
-- Dependencies: 281
-- Data for Name: personas; Type: TABLE DATA; Schema: public; Owner: -
--

COPY personas (id, primer_nombre, segundo_nombre, primer_apellido, segundo_apellido, id_localidad, calle, transversal, numero) FROM stdin;
1	Consumidor Final	\N	 	\N	1	 	 	 
\.


--
-- TOC entry 2960 (class 0 OID 48571)
-- Dependencies: 282
-- Data for Name: personas_correo_electronico; Type: TABLE DATA; Schema: public; Owner: -
--

COPY personas_correo_electronico (id, id_persona, correo_electronico, estado, fecha) FROM stdin;
\.


--
-- TOC entry 3160 (class 0 OID 0)
-- Dependencies: 283
-- Name: personas_correo_electronico_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('personas_correo_electronico_id_seq', 1, false);


--
-- TOC entry 2962 (class 0 OID 48577)
-- Dependencies: 284
-- Data for Name: personas_documentos_identificacion; Type: TABLE DATA; Schema: public; Owner: -
--

COPY personas_documentos_identificacion (id, id_persona, id_tipo_documento, numero_identificacion, estado, fecha) FROM stdin;
1	1	2	99999999	A	14:42:26.638127-05
\.


--
-- TOC entry 3161 (class 0 OID 0)
-- Dependencies: 285
-- Name: personas_documentos_identificacion_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('personas_documentos_identificacion_id_seq', 1, true);


--
-- TOC entry 3162 (class 0 OID 0)
-- Dependencies: 286
-- Name: personas_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('personas_id_seq', 2, true);


--
-- TOC entry 2965 (class 0 OID 48585)
-- Dependencies: 287
-- Data for Name: telefonos_personas; Type: TABLE DATA; Schema: public; Owner: -
--

COPY telefonos_personas (id, id_persona, numero, fecha, estado, id_operadora_telefonica) FROM stdin;
\.


--
-- TOC entry 3163 (class 0 OID 0)
-- Dependencies: 288
-- Name: telefonos_personas_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('telefonos_personas_id_seq', 1, false);


--
-- TOC entry 2967 (class 0 OID 48591)
-- Dependencies: 289
-- Data for Name: tipo_documento_identificacion; Type: TABLE DATA; Schema: public; Owner: -
--

COPY tipo_documento_identificacion (id, nombre, descripcion, estado, fecha) FROM stdin;
1	CEDULA	Cedula	A	15:51:09.398118-05
2	RUC	Ruc	A	15:51:19.429108-05
3	PASAPORTE	Pasaporte	A	15:51:33.948385-05
\.


--
-- TOC entry 3164 (class 0 OID 0)
-- Dependencies: 290
-- Name: tipo_documento_identificaion_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('tipo_documento_identificaion_id_seq', 1, false);


SET search_path = talento_humano, pg_catalog;

--
-- TOC entry 2970 (class 0 OID 48622)
-- Dependencies: 295
-- Data for Name: cargos; Type: TABLE DATA; Schema: talento_humano; Owner: -
--

COPY cargos (id, nombre, estado, fecha, id_padre) FROM stdin;
1	Administrador	A	2017-05-18 15:28:06.929823	0
\.


--
-- TOC entry 3165 (class 0 OID 0)
-- Dependencies: 296
-- Name: cargos_id_seq; Type: SEQUENCE SET; Schema: talento_humano; Owner: -
--

SELECT pg_catalog.setval('cargos_id_seq', 1, false);


--
-- TOC entry 2972 (class 0 OID 48628)
-- Dependencies: 297
-- Data for Name: empleados; Type: TABLE DATA; Schema: talento_humano; Owner: -
--

COPY empleados (id, id_persona, estado, fecha, id_usuario, id_cargo) FROM stdin;
1	1	A	2017-06-05 12:46:35.094297-05	usuario prueba 1	\N
\.


--
-- TOC entry 3166 (class 0 OID 0)
-- Dependencies: 298
-- Name: empleados_id_seq; Type: SEQUENCE SET; Schema: talento_humano; Owner: -
--

SELECT pg_catalog.setval('empleados_id_seq', 6, true);


--
-- TOC entry 2974 (class 0 OID 48638)
-- Dependencies: 300
-- Data for Name: jornadas_de_trabajo; Type: TABLE DATA; Schema: talento_humano; Owner: -
--

COPY jornadas_de_trabajo (id, nombre, descripcion, porsentaje_cobro, hora_inicio, hora_fin, hora_descanso) FROM stdin;
\.


--
-- TOC entry 3167 (class 0 OID 0)
-- Dependencies: 301
-- Name: jornadas_de_trabajo_id_seq; Type: SEQUENCE SET; Schema: talento_humano; Owner: -
--

SELECT pg_catalog.setval('jornadas_de_trabajo_id_seq', 1, false);


--
-- TOC entry 2976 (class 0 OID 48646)
-- Dependencies: 302
-- Data for Name: tipos_contratos; Type: TABLE DATA; Schema: talento_humano; Owner: -
--

COPY tipos_contratos (id, nombre, descripcion, estado, fecha) FROM stdin;
1	Expreso y Tacito	El contrato es expreso cuando el empleador y el trabajador acuerden las condiciones, sea de palabra o reduciéndolas a escrito.	A	2017-03-28 11:19:43.624048-05
3	Contratos por obra cierta, por tarea y a destajo	El contrato es por obra cierta, cuando el trabajador toma a su cargo la ejecución de una labor determinada por una remuneración\nque comprende la totalidad de la misma, sin tomar en consideración el tiempo que se invierta en ejecutarla.\nEn el contrato por tarea, el trabajador se compromete a ejecutar una determinada cantidad de obra o trabajo en la jornada o en un período de tiempo previamente establecido. Se entiende\nconcluida la jornada o período de tiempo, por el hecho de cumplirse la tarea.\nEn el contrato a destajo, el trabajo se realiza por piezas, trozos, medidas de superficie y, en general, por unidades de obra, y la remuneración se pacta para cada una de ellas, sin tomar en cuenta el\ntiempo invertido en la labor.	A	2017-03-28 11:24:07.787541-05
4	Contratos eventuales, ocasionales, de temporada.	Son contratos eventuales aquellos que se realizan para satisfacer exigencias circunstanciales del empleador, tales como\nreemplazo de personal que se encuentra ausente por vacaciones, licencia, enfermedad, maternidad y situaciones similares; en cuyo caso, en el contrato deberá puntualizarse las exigencias\ncircunstanciales que motivan la contratación, el nombre o nombres de los reemplazados y el plazo de duración de la misma.\nTambién se podrán celebrar contratos eventuales para atender una mayor demanda de producción o servicios en actividades habituales del empleador, en cuyo caso el contrato no podrá tener una\nduración mayor de ciento ochenta días continuos o discontinuos, dentro de un lapso de trescientos sesenta y cinco días. Si la circunstancia o requerimiento de los servicios del trabajador se repite\npor más de dos períodos anuales, el contrato se convertirá en contrato de temporada. El sueldo o salario que se pague en los contratos eventuales, tendrá un incremento del 35% del valor hora del\nsalario básico del sector al que corresponda el trabajador.\nSon contratos ocasionales, aquellos cuyo objeto es la atención de necesidades emergentes o extraordinarias, no vinculadas con la actividad habitual del empleador, y cuya duración no excederá de\ntreinta días en un año. El sueldo o salario que se pague en los contratos ocasionales, tendrá un incremento del 35% del valor hora del salario básico del sector al que corresponda el trabajador.\nSon contratos de temporada aquellos que en razón de la costumbre o de la contratación colectiva, se han venido celebrando entre una empresa o empleador y un trabajador o grupo de\ntrabajadores, para que realicen trabajos cíclicos o periódicos, en razón de la naturaleza discontinua de sus labores, gozando estos contratos de estabilidad, entendida, como el derecho de los\ntrabajadores a ser llamados a prestar sus servicios en cada temporada que se requieran. Se configurará el despido intempestivo si no lo fueren.	A	2017-03-28 11:25:20.805442-05
5	Contrato escrito	El contrato escrito puede celebrarse por instrumento público o por instrumento privado. Constará en un libro especial y se conferirá copia, en cualquier tiempo, a la\npersona que lo solicitare.	A	2017-03-28 11:26:17.790386-05
6	Contrato escrito obligatorio	Se celebrarán por escrito los siguientes contratos:\na) Los que versen sobre trabajos que requieran conocimientos técnicos o de un arte, o de una profesión determinada; \nb) Los de obra cierta cuyo valor de mano de obra exceda de cinco salarios básicos unificados de trabajador en general; \nc) Los a destajo o por tarea, que tengan más de un año de duración;\nd) Los que contengan período de prueba;\nPágina  3 de 77Fiel Web (www.fielweb.com) :: Ediciones Legales, 2015\ne) Los por grupo o por equipo;\nf) Los eventuales, ocasionales y de temporada;\ng) Los de aprendizaje;\nh) Los que se celebren con adolescentes que han cumplido quince años, incluidos los de aprendizaje; y,\ni) En general, los demás que se determine en la ley.	A	2017-03-28 11:27:07.968803-05
7	Sujeción a los contratos colectivos	De existir contratos colectivos, los individuales no podrán realizarse sino en la forma y condiciones fijadas en aquellos.	A	2017-03-28 11:31:04.731975-05
8	Contrato de equipo.	Si un equipo de trabajadores, organizado jurídicamente o no, celebrare contrato de trabajo\ncon uno o más empleadores, no habrá distinción de derechos y obligaciones entre los componentes del equipo; y el empleador o empleadores, como tales, no tendrán respecto de cada uno de ellos\ndeberes ni derechos, sino frente al grupo.\nEn consecuencia, el empleador no podrá despedir a uno o más trabajadores del equipo y, en caso de hacerlo, se considerará como despido de todo el grupo y pagará las indemnizaciones\ncorrespondientes a todos y cada uno de sus integrantes.	A	2017-03-28 11:36:03.287691-05
\.


--
-- TOC entry 3168 (class 0 OID 0)
-- Dependencies: 303
-- Name: tipos_contratos_id_seq; Type: SEQUENCE SET; Schema: talento_humano; Owner: -
--

SELECT pg_catalog.setval('tipos_contratos_id_seq', 8, true);


SET search_path = usuarios, pg_catalog;

--
-- TOC entry 2978 (class 0 OID 48655)
-- Dependencies: 304
-- Data for Name: tipo_usuario; Type: TABLE DATA; Schema: usuarios; Owner: -
--

COPY tipo_usuario (id, nombre, descripcion, estado, fecha) FROM stdin;
1	ADMIN	Ninguna	A	11:39:13.423733-05
\.


--
-- TOC entry 3169 (class 0 OID 0)
-- Dependencies: 305
-- Name: tipo_usuario_id_seq; Type: SEQUENCE SET; Schema: usuarios; Owner: -
--

SELECT pg_catalog.setval('tipo_usuario_id_seq', 1, true);


--
-- TOC entry 2980 (class 0 OID 48664)
-- Dependencies: 306
-- Data for Name: usuarios; Type: TABLE DATA; Schema: usuarios; Owner: -
--

COPY usuarios (id, nick, clave_clave, id_estado, fecha_creacion, estado_clave, id_tipo_usuario) FROM stdin;
usuario prueba 1	prueba	123455	A	\N	t	1
\.


SET search_path = ventas, pg_catalog;

--
-- TOC entry 2981 (class 0 OID 48668)
-- Dependencies: 307
-- Data for Name: caja; Type: TABLE DATA; Schema: ventas; Owner: -
--

COPY caja (id, nombre, id_sucursal, inicio_numero_factura, numero_fin_factura, estado, fecha) FROM stdin;
\.


--
-- TOC entry 3170 (class 0 OID 0)
-- Dependencies: 308
-- Name: caja_id_seq; Type: SEQUENCE SET; Schema: ventas; Owner: -
--

SELECT pg_catalog.setval('caja_id_seq', 1, false);


--
-- TOC entry 2983 (class 0 OID 48674)
-- Dependencies: 309
-- Data for Name: caja_usuario; Type: TABLE DATA; Schema: ventas; Owner: -
--

COPY caja_usuario (id_caja, id_usuario, id_empleado, estado, fecha) FROM stdin;
\.


--
-- TOC entry 2984 (class 0 OID 48678)
-- Dependencies: 310
-- Data for Name: clave_factura; Type: TABLE DATA; Schema: ventas; Owner: -
--

COPY clave_factura (id, id_factura, clave_factura, estado, fecha) FROM stdin;
\.


--
-- TOC entry 3171 (class 0 OID 0)
-- Dependencies: 311
-- Name: clave_factura_id_seq; Type: SEQUENCE SET; Schema: ventas; Owner: -
--

SELECT pg_catalog.setval('clave_factura_id_seq', 1, false);


--
-- TOC entry 2986 (class 0 OID 48684)
-- Dependencies: 312
-- Data for Name: detalle_factura; Type: TABLE DATA; Schema: ventas; Owner: -
--

COPY detalle_factura (id, id_factura, id_producto, precio_venta, cantidad, descuento, subtotal_item) FROM stdin;
\.


--
-- TOC entry 3172 (class 0 OID 0)
-- Dependencies: 313
-- Name: detalle_factura_id_seq; Type: SEQUENCE SET; Schema: ventas; Owner: -
--

SELECT pg_catalog.setval('detalle_factura_id_seq', 1, false);


--
-- TOC entry 2988 (class 0 OID 48689)
-- Dependencies: 314
-- Data for Name: empleado_factura; Type: TABLE DATA; Schema: ventas; Owner: -
--

COPY empleado_factura (id_empleado, id_factura, fecha) FROM stdin;
\.


--
-- TOC entry 2989 (class 0 OID 48693)
-- Dependencies: 315
-- Data for Name: facturas; Type: TABLE DATA; Schema: ventas; Owner: -
--

COPY facturas (id, numero_factura, numero_autorizacion, ruc_emisor, denominacion, direccion_matriz, direccion_sucursal, fecha_autorizacion, fecha_emicion, guia_remision, fecha_caducidad_factura, datos_imprenta, subtotal_iva, subtotal_sin_iva, descuentos, valor_iva, ice, total, estado, id_cliente) FROM stdin;
\.


--
-- TOC entry 3173 (class 0 OID 0)
-- Dependencies: 316
-- Name: facturas_id_seq; Type: SEQUENCE SET; Schema: ventas; Owner: -
--

SELECT pg_catalog.setval('facturas_id_seq', 1, false);


--
-- TOC entry 2969 (class 0 OID 48605)
-- Dependencies: 292
-- Data for Name: formas_pago; Type: TABLE DATA; Schema: ventas; Owner: -
--

COPY formas_pago (id, nombre, codigo_sri, descripcion, estado, fecha, id_padre) FROM stdin;
1	Contado	00	TODOS LOS PAGOS QUE SE REALICEN DE FORMA INMEDIATA	A	2017-04-21	0
6	EFECTIVO	01	SIN UTILIZACION DEL SISTEMA FINANCIERO	A	2017-01-20	1
7	COMPENSACION	15	COMPENSACION DE DEUDAS	A	2017-01-20	1
8	DEBITO	16	TARJETA DE DEBITO	A	2017-01-20	1
9	DINERO ELECTRONICO	17	DINERO ELECTRONICO	A	2017-01-20	1
11	TARJETA PREPAGO	18	TARJETA PREPAGO	A	2017-01-20	1
12	TARJETA CREDITO 	19	TARJETA DE CREDITO	A	2017-01-20	1
14	ENDOSO DE TITULOS	21	ENDOSO DE TITULOS	A	2017-01-20	1
13	OTROS FINACIERO	20	OTROS UTILIZACION DEL SISTEMA FINANCIERO	A	2017-01-20	1
2	Credito	00	LOS CREDITOS A LOS CLIENTES	A	2017-04-21	0
\.


--
-- TOC entry 2991 (class 0 OID 48702)
-- Dependencies: 317
-- Data for Name: formas_pago_facturas; Type: TABLE DATA; Schema: ventas; Owner: -
--

COPY formas_pago_facturas (id, id_factura, id_formas_pago) FROM stdin;
\.


--
-- TOC entry 3174 (class 0 OID 0)
-- Dependencies: 318
-- Name: formas_pago_facturas_id_seq; Type: SEQUENCE SET; Schema: ventas; Owner: -
--

SELECT pg_catalog.setval('formas_pago_facturas_id_seq', 1, false);


--
-- TOC entry 3175 (class 0 OID 0)
-- Dependencies: 319
-- Name: formas_pago_id_seq; Type: SEQUENCE SET; Schema: ventas; Owner: -
--

SELECT pg_catalog.setval('formas_pago_id_seq', 14, true);


--
-- TOC entry 2994 (class 0 OID 48709)
-- Dependencies: 320
-- Data for Name: producto_descuento; Type: TABLE DATA; Schema: ventas; Owner: -
--

COPY producto_descuento (id, id_producto, id_catalogo, estado, fecha_fin_descuento, fecha_inicio_descuento) FROM stdin;
\.


--
-- TOC entry 3176 (class 0 OID 0)
-- Dependencies: 321
-- Name: producto_descuento_id_seq; Type: SEQUENCE SET; Schema: ventas; Owner: -
--

SELECT pg_catalog.setval('producto_descuento_id_seq', 1, false);


SET search_path = administracion, pg_catalog;

--
-- TOC entry 2442 (class 2606 OID 48781)
-- Name: actividad_economica_PK; Type: CONSTRAINT; Schema: administracion; Owner: -; Tablespace: 
--

ALTER TABLE ONLY actividad_economica
    ADD CONSTRAINT "actividad_economica_PK" PRIMARY KEY (id);


--
-- TOC entry 2444 (class 2606 OID 48783)
-- Name: clientes_PK; Type: CONSTRAINT; Schema: administracion; Owner: -; Tablespace: 
--

ALTER TABLE ONLY clientes
    ADD CONSTRAINT "clientes_PK" PRIMARY KEY (id, tipo_cliente);


--
-- TOC entry 2446 (class 2606 OID 48785)
-- Name: empresas_PK; Type: CONSTRAINT; Schema: administracion; Owner: -; Tablespace: 
--

ALTER TABLE ONLY empresas
    ADD CONSTRAINT "empresas_PK" PRIMARY KEY (id);


--
-- TOC entry 2452 (class 2606 OID 48787)
-- Name: id_tipo_accion_vista_PK; Type: CONSTRAINT; Schema: administracion; Owner: -; Tablespace: 
--

ALTER TABLE ONLY tipo_accion_vista
    ADD CONSTRAINT "id_tipo_accion_vista_PK" PRIMARY KEY (id);


--
-- TOC entry 2450 (class 2606 OID 48789)
-- Name: imagen_empresa_PK; Type: CONSTRAINT; Schema: administracion; Owner: -; Tablespace: 
--

ALTER TABLE ONLY imagen_empresa
    ADD CONSTRAINT "imagen_empresa_PK" PRIMARY KEY (id);


--
-- TOC entry 2454 (class 2606 OID 48791)
-- Name: tipo_bienes_servicios_PK; Type: CONSTRAINT; Schema: administracion; Owner: -; Tablespace: 
--

ALTER TABLE ONLY tipo_bienes_servicios
    ADD CONSTRAINT "tipo_bienes_servicios_PK" PRIMARY KEY (id);


--
-- TOC entry 2456 (class 2606 OID 48793)
-- Name: tipo_empres; Type: CONSTRAINT; Schema: administracion; Owner: -; Tablespace: 
--

ALTER TABLE ONLY tipo_empresa
    ADD CONSTRAINT tipo_empres PRIMARY KEY (id);


--
-- TOC entry 2458 (class 2606 OID 48795)
-- Name: tipo_imagen_producto_PK; Type: CONSTRAINT; Schema: administracion; Owner: -; Tablespace: 
--

ALTER TABLE ONLY tipos_imagenes_empresas
    ADD CONSTRAINT "tipo_imagen_producto_PK" PRIMARY KEY (id);


--
-- TOC entry 2460 (class 2606 OID 48797)
-- Name: usuarios_privilegios_PK; Type: CONSTRAINT; Schema: administracion; Owner: -; Tablespace: 
--

ALTER TABLE ONLY usuarios_privilegios
    ADD CONSTRAINT "usuarios_privilegios_PK" PRIMARY KEY (id);


--
-- TOC entry 2448 (class 2606 OID 48799)
-- Name: valor_unico; Type: CONSTRAINT; Schema: administracion; Owner: -; Tablespace: 
--

ALTER TABLE ONLY empresas
    ADD CONSTRAINT valor_unico UNIQUE (razon_social);


--
-- TOC entry 2462 (class 2606 OID 48801)
-- Name: vistas_PK; Type: CONSTRAINT; Schema: administracion; Owner: -; Tablespace: 
--

ALTER TABLE ONLY vistas
    ADD CONSTRAINT "vistas_PK" PRIMARY KEY (id);


SET search_path = auditoria, pg_catalog;

--
-- TOC entry 2464 (class 2606 OID 48803)
-- Name: auditoria_pk; Type: CONSTRAINT; Schema: auditoria; Owner: -; Tablespace: 
--

ALTER TABLE ONLY auditoria
    ADD CONSTRAINT auditoria_pk PRIMARY KEY (id);


--
-- TOC entry 2466 (class 2606 OID 48805)
-- Name: ingreso_usuarios_PK; Type: CONSTRAINT; Schema: auditoria; Owner: -; Tablespace: 
--

ALTER TABLE ONLY ingresos_usuarios
    ADD CONSTRAINT "ingreso_usuarios_PK" PRIMARY KEY (id);


SET search_path = contabilidad, pg_catalog;

--
-- TOC entry 2470 (class 2606 OID 48807)
-- Name: ambito_impuesto_PK; Type: CONSTRAINT; Schema: contabilidad; Owner: -; Tablespace: 
--

ALTER TABLE ONLY ambitos_impuestos
    ADD CONSTRAINT "ambito_impuesto_PK" PRIMARY KEY (id);


--
-- TOC entry 2472 (class 2606 OID 48809)
-- Name: asiento_contable_PK; Type: CONSTRAINT; Schema: contabilidad; Owner: -; Tablespace: 
--

ALTER TABLE ONLY asientos_contables_diario
    ADD CONSTRAINT "asiento_contable_PK" PRIMARY KEY (id);


--
-- TOC entry 2474 (class 2606 OID 48811)
-- Name: bancos_PK; Type: CONSTRAINT; Schema: contabilidad; Owner: -; Tablespace: 
--

ALTER TABLE ONLY bancos
    ADD CONSTRAINT "bancos_PK" PRIMARY KEY (id);


--
-- TOC entry 2476 (class 2606 OID 48813)
-- Name: cuenta_contable_PK; Type: CONSTRAINT; Schema: contabilidad; Owner: -; Tablespace: 
--

ALTER TABLE ONLY cuentas_contables
    ADD CONSTRAINT "cuenta_contable_PK" PRIMARY KEY (id);


--
-- TOC entry 2492 (class 2606 OID 48815)
-- Name: facturas_pkey; Type: CONSTRAINT; Schema: contabilidad; Owner: -; Tablespace: 
--

ALTER TABLE ONLY repositorio_facturas
    ADD CONSTRAINT facturas_pkey PRIMARY KEY (id_factura);


--
-- TOC entry 2494 (class 2606 OID 48817)
-- Name: facturas_rechazadas_pkey; Type: CONSTRAINT; Schema: contabilidad; Owner: -; Tablespace: 
--

ALTER TABLE ONLY repositorio_facturas_rechazadas
    ADD CONSTRAINT facturas_rechazadas_pkey PRIMARY KEY (id_factura_r);


--
-- TOC entry 2480 (class 2606 OID 48819)
-- Name: fecha_declaracion_impuestos; Type: CONSTRAINT; Schema: contabilidad; Owner: -; Tablespace: 
--

ALTER TABLE ONLY fecha_declaracion_ruc
    ADD CONSTRAINT fecha_declaracion_impuestos PRIMARY KEY (noveno_dig);


--
-- TOC entry 2482 (class 2606 OID 48821)
-- Name: finaciamiento_PK; Type: CONSTRAINT; Schema: contabilidad; Owner: -; Tablespace: 
--

ALTER TABLE ONLY finaciaminto
    ADD CONSTRAINT "finaciamiento_PK" PRIMARY KEY (id);


--
-- TOC entry 2484 (class 2606 OID 48823)
-- Name: gasto_mes_factura; Type: CONSTRAINT; Schema: contabilidad; Owner: -; Tablespace: 
--

ALTER TABLE ONLY gasto_mes_repositorio
    ADD CONSTRAINT gasto_mes_factura PRIMARY KEY (id);


--
-- TOC entry 2486 (class 2606 OID 48825)
-- Name: gastos_impueto_renta_deducion_PK; Type: CONSTRAINT; Schema: contabilidad; Owner: -; Tablespace: 
--

ALTER TABLE ONLY gastos_impuestos_renta_deduccion
    ADD CONSTRAINT "gastos_impueto_renta_deducion_PK" PRIMARY KEY (id);


--
-- TOC entry 2504 (class 2606 OID 48827)
-- Name: gastos_personales_PK; Type: CONSTRAINT; Schema: contabilidad; Owner: -; Tablespace: 
--

ALTER TABLE ONLY tipos_gastos_personales
    ADD CONSTRAINT "gastos_personales_PK" PRIMARY KEY (id);


--
-- TOC entry 2488 (class 2606 OID 48829)
-- Name: grupo_impuesto_PK; Type: CONSTRAINT; Schema: contabilidad; Owner: -; Tablespace: 
--

ALTER TABLE ONLY grupo_impuestos
    ADD CONSTRAINT "grupo_impuesto_PK" PRIMARY KEY (id);


--
-- TOC entry 2490 (class 2606 OID 48831)
-- Name: impuesto_PK; Type: CONSTRAINT; Schema: contabilidad; Owner: -; Tablespace: 
--

ALTER TABLE ONLY impuestos
    ADD CONSTRAINT "impuesto_PK" PRIMARY KEY (id);


--
-- TOC entry 2468 (class 2606 OID 48833)
-- Name: plazos_credito_PK; Type: CONSTRAINT; Schema: contabilidad; Owner: -; Tablespace: 
--

ALTER TABLE ONLY plazos_credito
    ADD CONSTRAINT "plazos_credito_PK" PRIMARY KEY (id);


--
-- TOC entry 2478 (class 2606 OID 48835)
-- Name: repositorio_facturas_correo_PK; Type: CONSTRAINT; Schema: contabilidad; Owner: -; Tablespace: 
--

ALTER TABLE ONLY repositorio_facturas_correo
    ADD CONSTRAINT "repositorio_facturas_correo_PK" PRIMARY KEY (id);


--
-- TOC entry 2496 (class 2606 OID 48837)
-- Name: rol_pagos_PK; Type: CONSTRAINT; Schema: contabilidad; Owner: -; Tablespace: 
--

ALTER TABLE ONLY rol_pagos_empleados
    ADD CONSTRAINT "rol_pagos_PK" PRIMARY KEY (id);


--
-- TOC entry 2498 (class 2606 OID 48839)
-- Name: tipo_cueta_contable; Type: CONSTRAINT; Schema: contabilidad; Owner: -; Tablespace: 
--

ALTER TABLE ONLY tipos_cuentas_contables
    ADD CONSTRAINT tipo_cueta_contable PRIMARY KEY (id);


--
-- TOC entry 2500 (class 2606 OID 48841)
-- Name: tipo_documentos_pkey; Type: CONSTRAINT; Schema: contabilidad; Owner: -; Tablespace: 
--

ALTER TABLE ONLY tipo_documentos
    ADD CONSTRAINT tipo_documentos_pkey PRIMARY KEY (id);


--
-- TOC entry 2502 (class 2606 OID 48843)
-- Name: tipo_impuestos_pkey; Type: CONSTRAINT; Schema: contabilidad; Owner: -; Tablespace: 
--

ALTER TABLE ONLY tipo_impuestos
    ADD CONSTRAINT tipo_impuestos_pkey PRIMARY KEY (id);


SET search_path = inventario, pg_catalog;

--
-- TOC entry 2506 (class 2606 OID 48845)
-- Name: bodega_pro_PK; Type: CONSTRAINT; Schema: inventario; Owner: -; Tablespace: 
--

ALTER TABLE ONLY bodegas
    ADD CONSTRAINT "bodega_pro_PK" PRIMARY KEY (id);


--
-- TOC entry 2510 (class 2606 OID 48847)
-- Name: categorias_PK; Type: CONSTRAINT; Schema: inventario; Owner: -; Tablespace: 
--

ALTER TABLE ONLY categorias
    ADD CONSTRAINT "categorias_PK" PRIMARY KEY (id);


--
-- TOC entry 2512 (class 2606 OID 48849)
-- Name: descripcion_producto_PK; Type: CONSTRAINT; Schema: inventario; Owner: -; Tablespace: 
--

ALTER TABLE ONLY descripcion_producto
    ADD CONSTRAINT "descripcion_producto_PK" PRIMARY KEY (id);


--
-- TOC entry 2514 (class 2606 OID 48851)
-- Name: estado_descriptivo_PK; Type: CONSTRAINT; Schema: inventario; Owner: -; Tablespace: 
--

ALTER TABLE ONLY estado_descriptivo
    ADD CONSTRAINT "estado_descriptivo_PK" PRIMARY KEY (id);


--
-- TOC entry 2516 (class 2606 OID 48853)
-- Name: garantia_PK; Type: CONSTRAINT; Schema: inventario; Owner: -; Tablespace: 
--

ALTER TABLE ONLY garantias
    ADD CONSTRAINT "garantia_PK" PRIMARY KEY (id);


--
-- TOC entry 2508 (class 2606 OID 48855)
-- Name: id; Type: CONSTRAINT; Schema: inventario; Owner: -; Tablespace: 
--

ALTER TABLE ONLY catalogos
    ADD CONSTRAINT id PRIMARY KEY (id);


--
-- TOC entry 2518 (class 2606 OID 48857)
-- Name: imagenes_productos_PK; Type: CONSTRAINT; Schema: inventario; Owner: -; Tablespace: 
--

ALTER TABLE ONLY imagenes_productos
    ADD CONSTRAINT "imagenes_productos_PK" PRIMARY KEY (id);


--
-- TOC entry 2520 (class 2606 OID 48859)
-- Name: manejo_presios_PK; Type: CONSTRAINT; Schema: inventario; Owner: -; Tablespace: 
--

ALTER TABLE ONLY manejo_presios
    ADD CONSTRAINT "manejo_presios_PK" PRIMARY KEY (id);


--
-- TOC entry 2522 (class 2606 OID 48861)
-- Name: marca_PK; Type: CONSTRAINT; Schema: inventario; Owner: -; Tablespace: 
--

ALTER TABLE ONLY marcas
    ADD CONSTRAINT "marca_PK" PRIMARY KEY (id);


--
-- TOC entry 2524 (class 2606 OID 48863)
-- Name: modelos_PK; Type: CONSTRAINT; Schema: inventario; Owner: -; Tablespace: 
--

ALTER TABLE ONLY modelos
    ADD CONSTRAINT "modelos_PK" PRIMARY KEY (id);


--
-- TOC entry 2526 (class 2606 OID 48865)
-- Name: producto_PK; Type: CONSTRAINT; Schema: inventario; Owner: -; Tablespace: 
--

ALTER TABLE ONLY productos
    ADD CONSTRAINT "producto_PK" PRIMARY KEY (id);


--
-- TOC entry 2528 (class 2606 OID 48867)
-- Name: productos_impuestos_PK; Type: CONSTRAINT; Schema: inventario; Owner: -; Tablespace: 
--

ALTER TABLE ONLY productos_impuestos
    ADD CONSTRAINT "productos_impuestos_PK" PRIMARY KEY (id);


--
-- TOC entry 2530 (class 2606 OID 48869)
-- Name: proveedores_PK; Type: CONSTRAINT; Schema: inventario; Owner: -; Tablespace: 
--

ALTER TABLE ONLY proveedores
    ADD CONSTRAINT "proveedores_PK" PRIMARY KEY (id);


--
-- TOC entry 2534 (class 2606 OID 48871)
-- Name: tipo_catalogo_PK; Type: CONSTRAINT; Schema: inventario; Owner: -; Tablespace: 
--

ALTER TABLE ONLY tipos_catalogos
    ADD CONSTRAINT "tipo_catalogo_PK" PRIMARY KEY (id);


--
-- TOC entry 2532 (class 2606 OID 48873)
-- Name: tipo_consumo_pkey; Type: CONSTRAINT; Schema: inventario; Owner: -; Tablespace: 
--

ALTER TABLE ONLY tipo_consumo
    ADD CONSTRAINT tipo_consumo_pkey PRIMARY KEY (id);


--
-- TOC entry 2540 (class 2606 OID 48875)
-- Name: tipo_imagen_producto_PK; Type: CONSTRAINT; Schema: inventario; Owner: -; Tablespace: 
--

ALTER TABLE ONLY tipos_imagenes_productos
    ADD CONSTRAINT "tipo_imagen_producto_PK" PRIMARY KEY (id);


--
-- TOC entry 2542 (class 2606 OID 48877)
-- Name: tipo_pruducto_PK; Type: CONSTRAINT; Schema: inventario; Owner: -; Tablespace: 
--

ALTER TABLE ONLY tipos_productos
    ADD CONSTRAINT "tipo_pruducto_PK" PRIMARY KEY (id);


--
-- TOC entry 2536 (class 2606 OID 48879)
-- Name: tipos_categorias_PK; Type: CONSTRAINT; Schema: inventario; Owner: -; Tablespace: 
--

ALTER TABLE ONLY tipos_categorias
    ADD CONSTRAINT "tipos_categorias_PK" PRIMARY KEY (id);


--
-- TOC entry 2538 (class 2606 OID 48881)
-- Name: tipos_garantia_PK; Type: CONSTRAINT; Schema: inventario; Owner: -; Tablespace: 
--

ALTER TABLE ONLY tipos_garantias
    ADD CONSTRAINT "tipos_garantia_PK" PRIMARY KEY (id);


--
-- TOC entry 2544 (class 2606 OID 48883)
-- Name: tipos_tipo_consumo_PK; Type: CONSTRAINT; Schema: inventario; Owner: -; Tablespace: 
--

ALTER TABLE ONLY tipos_tipo_consumo
    ADD CONSTRAINT "tipos_tipo_consumo_PK" PRIMARY KEY (id);


--
-- TOC entry 2546 (class 2606 OID 48885)
-- Name: ubicacion_PK; Type: CONSTRAINT; Schema: inventario; Owner: -; Tablespace: 
--

ALTER TABLE ONLY ubicaciones
    ADD CONSTRAINT "ubicacion_PK" PRIMARY KEY (id);


SET search_path = public, pg_catalog;

--
-- TOC entry 2554 (class 2606 OID 48887)
-- Name: correo_elctronico_PK; Type: CONSTRAINT; Schema: public; Owner: -; Tablespace: 
--

ALTER TABLE ONLY personas_correo_electronico
    ADD CONSTRAINT "correo_elctronico_PK" PRIMARY KEY (id);


--
-- TOC entry 2556 (class 2606 OID 48889)
-- Name: documeto_identificacion; Type: CONSTRAINT; Schema: public; Owner: -; Tablespace: 
--

ALTER TABLE ONLY personas_documentos_identificacion
    ADD CONSTRAINT documeto_identificacion PRIMARY KEY (id_persona, numero_identificacion);


--
-- TOC entry 2548 (class 2606 OID 48891)
-- Name: estado_PK; Type: CONSTRAINT; Schema: public; Owner: -; Tablespace: 
--

ALTER TABLE ONLY estados
    ADD CONSTRAINT "estado_PK" PRIMARY KEY (id);


--
-- TOC entry 2550 (class 2606 OID 48893)
-- Name: operadoras_telefonicas_PK; Type: CONSTRAINT; Schema: public; Owner: -; Tablespace: 
--

ALTER TABLE ONLY operadoras_telefonicas
    ADD CONSTRAINT "operadoras_telefonicas_PK" PRIMARY KEY (id);


--
-- TOC entry 2552 (class 2606 OID 48895)
-- Name: persona_PK; Type: CONSTRAINT; Schema: public; Owner: -; Tablespace: 
--

ALTER TABLE ONLY personas
    ADD CONSTRAINT "persona_PK" PRIMARY KEY (id);


--
-- TOC entry 2558 (class 2606 OID 48897)
-- Name: telefonos_personas_PK; Type: CONSTRAINT; Schema: public; Owner: -; Tablespace: 
--

ALTER TABLE ONLY telefonos_personas
    ADD CONSTRAINT "telefonos_personas_PK" PRIMARY KEY (id);


--
-- TOC entry 2560 (class 2606 OID 48899)
-- Name: tipo_documento_identificacion_PK; Type: CONSTRAINT; Schema: public; Owner: -; Tablespace: 
--

ALTER TABLE ONLY tipo_documento_identificacion
    ADD CONSTRAINT "tipo_documento_identificacion_PK" PRIMARY KEY (id);


SET search_path = talento_humano, pg_catalog;

--
-- TOC entry 2566 (class 2606 OID 48901)
-- Name: empleado_PK; Type: CONSTRAINT; Schema: talento_humano; Owner: -; Tablespace: 
--

ALTER TABLE ONLY empleados
    ADD CONSTRAINT "empleado_PK" PRIMARY KEY (id);


--
-- TOC entry 2564 (class 2606 OID 48903)
-- Name: id_cargo_PK; Type: CONSTRAINT; Schema: talento_humano; Owner: -; Tablespace: 
--

ALTER TABLE ONLY cargos
    ADD CONSTRAINT "id_cargo_PK" PRIMARY KEY (id);


--
-- TOC entry 2568 (class 2606 OID 48905)
-- Name: jornada_trabajo_PK; Type: CONSTRAINT; Schema: talento_humano; Owner: -; Tablespace: 
--

ALTER TABLE ONLY jornadas_de_trabajo
    ADD CONSTRAINT "jornada_trabajo_PK" PRIMARY KEY (id);


--
-- TOC entry 2570 (class 2606 OID 48907)
-- Name: tipo_contrato_PK; Type: CONSTRAINT; Schema: talento_humano; Owner: -; Tablespace: 
--

ALTER TABLE ONLY tipos_contratos
    ADD CONSTRAINT "tipo_contrato_PK" PRIMARY KEY (id);


SET search_path = usuarios, pg_catalog;

--
-- TOC entry 2572 (class 2606 OID 48909)
-- Name: tipo_usuario_PK; Type: CONSTRAINT; Schema: usuarios; Owner: -; Tablespace: 
--

ALTER TABLE ONLY tipo_usuario
    ADD CONSTRAINT "tipo_usuario_PK" PRIMARY KEY (id);


--
-- TOC entry 2574 (class 2606 OID 48911)
-- Name: usuarios_PK; Type: CONSTRAINT; Schema: usuarios; Owner: -; Tablespace: 
--

ALTER TABLE ONLY usuarios
    ADD CONSTRAINT "usuarios_PK" PRIMARY KEY (id);


SET search_path = ventas, pg_catalog;

--
-- TOC entry 2578 (class 2606 OID 48913)
-- Name: caja_usuario_PK; Type: CONSTRAINT; Schema: ventas; Owner: -; Tablespace: 
--

ALTER TABLE ONLY caja_usuario
    ADD CONSTRAINT "caja_usuario_PK" PRIMARY KEY (id_caja, id_usuario, id_empleado);


--
-- TOC entry 2582 (class 2606 OID 48915)
-- Name: detalle_factura_pkey; Type: CONSTRAINT; Schema: ventas; Owner: -; Tablespace: 
--

ALTER TABLE ONLY detalle_factura
    ADD CONSTRAINT detalle_factura_pkey PRIMARY KEY (id);


--
-- TOC entry 2584 (class 2606 OID 48917)
-- Name: empleado_factura_PK; Type: CONSTRAINT; Schema: ventas; Owner: -; Tablespace: 
--

ALTER TABLE ONLY empleado_factura
    ADD CONSTRAINT "empleado_factura_PK" PRIMARY KEY (id_empleado, id_factura);


--
-- TOC entry 2586 (class 2606 OID 48919)
-- Name: factura_PK; Type: CONSTRAINT; Schema: ventas; Owner: -; Tablespace: 
--

ALTER TABLE ONLY facturas
    ADD CONSTRAINT "factura_PK" PRIMARY KEY (id);


--
-- TOC entry 2588 (class 2606 OID 48921)
-- Name: formas_pago_facturas_PK; Type: CONSTRAINT; Schema: ventas; Owner: -; Tablespace: 
--

ALTER TABLE ONLY formas_pago_facturas
    ADD CONSTRAINT "formas_pago_facturas_PK" PRIMARY KEY (id);


--
-- TOC entry 2562 (class 2606 OID 48923)
-- Name: formas_pago_pkey; Type: CONSTRAINT; Schema: ventas; Owner: -; Tablespace: 
--

ALTER TABLE ONLY formas_pago
    ADD CONSTRAINT formas_pago_pkey PRIMARY KEY (id);


--
-- TOC entry 2576 (class 2606 OID 48925)
-- Name: id_caja_PK; Type: CONSTRAINT; Schema: ventas; Owner: -; Tablespace: 
--

ALTER TABLE ONLY caja
    ADD CONSTRAINT "id_caja_PK" PRIMARY KEY (id);


--
-- TOC entry 2580 (class 2606 OID 48927)
-- Name: id_clave_factura_PK; Type: CONSTRAINT; Schema: ventas; Owner: -; Tablespace: 
--

ALTER TABLE ONLY clave_factura
    ADD CONSTRAINT "id_clave_factura_PK" PRIMARY KEY (id);


--
-- TOC entry 2590 (class 2606 OID 48929)
-- Name: producto_descuento_PK; Type: CONSTRAINT; Schema: ventas; Owner: -; Tablespace: 
--

ALTER TABLE ONLY producto_descuento
    ADD CONSTRAINT "producto_descuento_PK" PRIMARY KEY (id);


SET search_path = administracion, pg_catalog;

--
-- TOC entry 2677 (class 2620 OID 48930)
-- Name: actividad_economica_tg_audit; Type: TRIGGER; Schema: administracion; Owner: -
--

CREATE TRIGGER actividad_economica_tg_audit AFTER INSERT OR DELETE OR UPDATE ON actividad_economica FOR EACH ROW EXECUTE PROCEDURE public.fun_auditoria();


--
-- TOC entry 2678 (class 2620 OID 48931)
-- Name: clientes_tg_audit; Type: TRIGGER; Schema: administracion; Owner: -
--

CREATE TRIGGER clientes_tg_audit AFTER INSERT OR DELETE OR UPDATE ON clientes FOR EACH ROW EXECUTE PROCEDURE public.fun_auditoria();


--
-- TOC entry 2679 (class 2620 OID 48932)
-- Name: empresas_tg_audit; Type: TRIGGER; Schema: administracion; Owner: -
--

CREATE TRIGGER empresas_tg_audit AFTER INSERT OR DELETE OR UPDATE ON empresas FOR EACH ROW EXECUTE PROCEDURE public.fun_auditoria();


--
-- TOC entry 2681 (class 2620 OID 48933)
-- Name: empresas_tg_audit; Type: TRIGGER; Schema: administracion; Owner: -
--

CREATE TRIGGER empresas_tg_audit AFTER INSERT OR DELETE OR UPDATE ON imagen_empresa FOR EACH ROW EXECUTE PROCEDURE public.fun_auditoria();


--
-- TOC entry 2680 (class 2620 OID 48934)
-- Name: empresas_tg_cliente; Type: TRIGGER; Schema: administracion; Owner: -
--

CREATE TRIGGER empresas_tg_cliente AFTER INSERT OR DELETE OR UPDATE ON empresas FOR EACH ROW EXECUTE PROCEDURE public.fun_cliente_empresa();


--
-- TOC entry 2682 (class 2620 OID 48935)
-- Name: tipo_accion_vista_tg_audit; Type: TRIGGER; Schema: administracion; Owner: -
--

CREATE TRIGGER tipo_accion_vista_tg_audit AFTER INSERT OR DELETE OR UPDATE ON tipo_accion_vista FOR EACH ROW EXECUTE PROCEDURE public.fun_auditoria();


--
-- TOC entry 2683 (class 2620 OID 48936)
-- Name: tipo_bienes_servicios_vista_tg_audit; Type: TRIGGER; Schema: administracion; Owner: -
--

CREATE TRIGGER tipo_bienes_servicios_vista_tg_audit AFTER INSERT OR DELETE OR UPDATE ON tipo_bienes_servicios FOR EACH ROW EXECUTE PROCEDURE public.fun_auditoria();


--
-- TOC entry 2684 (class 2620 OID 48937)
-- Name: tipo_empresa_tg_audit; Type: TRIGGER; Schema: administracion; Owner: -
--

CREATE TRIGGER tipo_empresa_tg_audit AFTER INSERT OR DELETE OR UPDATE ON tipo_empresa FOR EACH ROW EXECUTE PROCEDURE public.fun_auditoria();


--
-- TOC entry 2685 (class 2620 OID 48938)
-- Name: usuarios_privilegios_tg_audit; Type: TRIGGER; Schema: administracion; Owner: -
--

CREATE TRIGGER usuarios_privilegios_tg_audit AFTER INSERT OR DELETE OR UPDATE ON usuarios_privilegios FOR EACH ROW EXECUTE PROCEDURE public.fun_auditoria();


SET search_path = contabilidad, pg_catalog;

--
-- TOC entry 2687 (class 2620 OID 48939)
-- Name: asientos_contables_diario_tg_audit; Type: TRIGGER; Schema: contabilidad; Owner: -
--

CREATE TRIGGER asientos_contables_diario_tg_audit AFTER INSERT OR DELETE OR UPDATE ON asientos_contables_diario FOR EACH ROW EXECUTE PROCEDURE public.fun_auditoria();


--
-- TOC entry 2688 (class 2620 OID 48940)
-- Name: bancos_tg_audit; Type: TRIGGER; Schema: contabilidad; Owner: -
--

CREATE TRIGGER bancos_tg_audit AFTER INSERT OR DELETE OR UPDATE ON bancos FOR EACH ROW EXECUTE PROCEDURE public.fun_auditoria();


--
-- TOC entry 2689 (class 2620 OID 48941)
-- Name: cuentas_contables_tg_audit; Type: TRIGGER; Schema: contabilidad; Owner: -
--

CREATE TRIGGER cuentas_contables_tg_audit AFTER INSERT OR DELETE OR UPDATE ON cuentas_contables FOR EACH ROW EXECUTE PROCEDURE public.fun_auditoria();


--
-- TOC entry 2690 (class 2620 OID 48942)
-- Name: gasto_mes_repositorio_tg_audit; Type: TRIGGER; Schema: contabilidad; Owner: -
--

CREATE TRIGGER gasto_mes_repositorio_tg_audit AFTER INSERT OR DELETE OR UPDATE ON gasto_mes_repositorio FOR EACH ROW EXECUTE PROCEDURE public.fun_auditoria();


--
-- TOC entry 2691 (class 2620 OID 48943)
-- Name: gastos_impuestos_renta_deduccion_tg_audit; Type: TRIGGER; Schema: contabilidad; Owner: -
--

CREATE TRIGGER gastos_impuestos_renta_deduccion_tg_audit AFTER INSERT OR DELETE OR UPDATE ON gastos_impuestos_renta_deduccion FOR EACH ROW EXECUTE PROCEDURE public.fun_auditoria();


--
-- TOC entry 2692 (class 2620 OID 48944)
-- Name: genealogia_impuestos_tg_audit; Type: TRIGGER; Schema: contabilidad; Owner: -
--

CREATE TRIGGER genealogia_impuestos_tg_audit AFTER INSERT OR DELETE OR UPDATE ON genealogia_impuestos FOR EACH ROW EXECUTE PROCEDURE public.fun_auditoria();


--
-- TOC entry 2686 (class 2620 OID 48945)
-- Name: personas_tg_audit; Type: TRIGGER; Schema: contabilidad; Owner: -
--

CREATE TRIGGER personas_tg_audit AFTER INSERT OR DELETE OR UPDATE ON ambitos_impuestos FOR EACH ROW EXECUTE PROCEDURE public.fun_auditoria();


--
-- TOC entry 2693 (class 2620 OID 48946)
-- Name: personas_tg_audit; Type: TRIGGER; Schema: contabilidad; Owner: -
--

CREATE TRIGGER personas_tg_audit AFTER INSERT OR DELETE OR UPDATE ON grupo_impuestos FOR EACH ROW EXECUTE PROCEDURE public.fun_auditoria();


--
-- TOC entry 2694 (class 2620 OID 48947)
-- Name: personas_tg_audit; Type: TRIGGER; Schema: contabilidad; Owner: -
--

CREATE TRIGGER personas_tg_audit AFTER INSERT OR DELETE OR UPDATE ON impuestos FOR EACH ROW EXECUTE PROCEDURE public.fun_auditoria();


--
-- TOC entry 2696 (class 2620 OID 48948)
-- Name: tipo_documentos_tg_audit; Type: TRIGGER; Schema: contabilidad; Owner: -
--

CREATE TRIGGER tipo_documentos_tg_audit AFTER INSERT OR DELETE OR UPDATE ON tipo_documentos FOR EACH ROW EXECUTE PROCEDURE public.fun_auditoria();


--
-- TOC entry 2697 (class 2620 OID 48949)
-- Name: tipo_impuestos_tg_audit; Type: TRIGGER; Schema: contabilidad; Owner: -
--

CREATE TRIGGER tipo_impuestos_tg_audit AFTER INSERT OR DELETE OR UPDATE ON tipo_impuestos FOR EACH ROW EXECUTE PROCEDURE public.fun_auditoria();


--
-- TOC entry 2695 (class 2620 OID 48950)
-- Name: tipos_cuentas_contables_tg_audit; Type: TRIGGER; Schema: contabilidad; Owner: -
--

CREATE TRIGGER tipos_cuentas_contables_tg_audit AFTER INSERT OR DELETE OR UPDATE ON tipos_cuentas_contables FOR EACH ROW EXECUTE PROCEDURE public.fun_auditoria();


--
-- TOC entry 2698 (class 2620 OID 48951)
-- Name: tipos_gastos_personales_tg_audit; Type: TRIGGER; Schema: contabilidad; Owner: -
--

CREATE TRIGGER tipos_gastos_personales_tg_audit AFTER INSERT OR DELETE OR UPDATE ON tipos_gastos_personales FOR EACH ROW EXECUTE PROCEDURE public.fun_auditoria();


SET search_path = inventario, pg_catalog;

--
-- TOC entry 2699 (class 2620 OID 48952)
-- Name: bodegas_tg_audit; Type: TRIGGER; Schema: inventario; Owner: -
--

CREATE TRIGGER bodegas_tg_audit AFTER INSERT OR DELETE OR UPDATE ON bodegas FOR EACH ROW EXECUTE PROCEDURE public.fun_auditoria();


--
-- TOC entry 2701 (class 2620 OID 48953)
-- Name: personas_tg_audit; Type: TRIGGER; Schema: inventario; Owner: -
--

CREATE TRIGGER personas_tg_audit AFTER INSERT OR DELETE OR UPDATE ON categorias FOR EACH ROW EXECUTE PROCEDURE public.fun_auditoria();


--
-- TOC entry 2702 (class 2620 OID 48954)
-- Name: personas_tg_audit; Type: TRIGGER; Schema: inventario; Owner: -
--

CREATE TRIGGER personas_tg_audit AFTER INSERT OR DELETE OR UPDATE ON descripcion_producto FOR EACH ROW EXECUTE PROCEDURE public.fun_auditoria();


--
-- TOC entry 2703 (class 2620 OID 48955)
-- Name: personas_tg_audit; Type: TRIGGER; Schema: inventario; Owner: -
--

CREATE TRIGGER personas_tg_audit AFTER INSERT OR DELETE OR UPDATE ON estado_descriptivo FOR EACH ROW EXECUTE PROCEDURE public.fun_auditoria();


--
-- TOC entry 2704 (class 2620 OID 48956)
-- Name: personas_tg_audit; Type: TRIGGER; Schema: inventario; Owner: -
--

CREATE TRIGGER personas_tg_audit AFTER INSERT OR DELETE OR UPDATE ON garantias FOR EACH ROW EXECUTE PROCEDURE public.fun_auditoria();


--
-- TOC entry 2705 (class 2620 OID 48957)
-- Name: personas_tg_audit; Type: TRIGGER; Schema: inventario; Owner: -
--

CREATE TRIGGER personas_tg_audit AFTER INSERT OR DELETE OR UPDATE ON imagenes_productos FOR EACH ROW EXECUTE PROCEDURE public.fun_auditoria();


--
-- TOC entry 2706 (class 2620 OID 48958)
-- Name: personas_tg_audit; Type: TRIGGER; Schema: inventario; Owner: -
--

CREATE TRIGGER personas_tg_audit AFTER INSERT OR DELETE OR UPDATE ON marcas FOR EACH ROW EXECUTE PROCEDURE public.fun_auditoria();


--
-- TOC entry 2707 (class 2620 OID 48959)
-- Name: personas_tg_audit; Type: TRIGGER; Schema: inventario; Owner: -
--

CREATE TRIGGER personas_tg_audit AFTER INSERT OR DELETE OR UPDATE ON modelos FOR EACH ROW EXECUTE PROCEDURE public.fun_auditoria();


--
-- TOC entry 2710 (class 2620 OID 48960)
-- Name: personas_tg_audit; Type: TRIGGER; Schema: inventario; Owner: -
--

CREATE TRIGGER personas_tg_audit AFTER INSERT OR DELETE OR UPDATE ON proveedores FOR EACH ROW EXECUTE PROCEDURE public.fun_auditoria();


--
-- TOC entry 2714 (class 2620 OID 48961)
-- Name: personas_tg_audit; Type: TRIGGER; Schema: inventario; Owner: -
--

CREATE TRIGGER personas_tg_audit AFTER INSERT OR DELETE OR UPDATE ON tipos_categorias FOR EACH ROW EXECUTE PROCEDURE public.fun_auditoria();


--
-- TOC entry 2715 (class 2620 OID 48962)
-- Name: personas_tg_audit; Type: TRIGGER; Schema: inventario; Owner: -
--

CREATE TRIGGER personas_tg_audit AFTER INSERT OR DELETE OR UPDATE ON tipos_garantias FOR EACH ROW EXECUTE PROCEDURE public.fun_auditoria();


--
-- TOC entry 2716 (class 2620 OID 48963)
-- Name: personas_tg_audit; Type: TRIGGER; Schema: inventario; Owner: -
--

CREATE TRIGGER personas_tg_audit AFTER INSERT OR DELETE OR UPDATE ON tipos_imagenes_productos FOR EACH ROW EXECUTE PROCEDURE public.fun_auditoria();


--
-- TOC entry 2717 (class 2620 OID 48964)
-- Name: personas_tg_audit; Type: TRIGGER; Schema: inventario; Owner: -
--

CREATE TRIGGER personas_tg_audit AFTER INSERT OR DELETE OR UPDATE ON tipos_productos FOR EACH ROW EXECUTE PROCEDURE public.fun_auditoria();


--
-- TOC entry 2712 (class 2620 OID 48965)
-- Name: personas_tg_audit; Type: TRIGGER; Schema: inventario; Owner: -
--

CREATE TRIGGER personas_tg_audit AFTER INSERT OR DELETE OR UPDATE ON tipos_catalogos FOR EACH ROW EXECUTE PROCEDURE public.fun_auditoria();


--
-- TOC entry 2700 (class 2620 OID 48966)
-- Name: personas_tg_audit; Type: TRIGGER; Schema: inventario; Owner: -
--

CREATE TRIGGER personas_tg_audit AFTER INSERT OR DELETE OR UPDATE ON catalogos FOR EACH ROW EXECUTE PROCEDURE public.fun_auditoria();


--
-- TOC entry 2709 (class 2620 OID 48967)
-- Name: productos_impuestos_tg_audit; Type: TRIGGER; Schema: inventario; Owner: -
--

CREATE TRIGGER productos_impuestos_tg_audit AFTER INSERT OR DELETE OR UPDATE ON productos_impuestos FOR EACH ROW EXECUTE PROCEDURE public.fun_auditoria();


--
-- TOC entry 2708 (class 2620 OID 48968)
-- Name: productos_tg_audit; Type: TRIGGER; Schema: inventario; Owner: -
--

CREATE TRIGGER productos_tg_audit AFTER INSERT OR DELETE OR UPDATE ON productos FOR EACH ROW EXECUTE PROCEDURE public.fun_auditoria();


--
-- TOC entry 2711 (class 2620 OID 48969)
-- Name: tipo_consumo_tg_audit; Type: TRIGGER; Schema: inventario; Owner: -
--

CREATE TRIGGER tipo_consumo_tg_audit AFTER INSERT OR DELETE OR UPDATE ON tipo_consumo FOR EACH ROW EXECUTE PROCEDURE public.fun_auditoria();


--
-- TOC entry 2713 (class 2620 OID 48970)
-- Name: tipos_catalogos_tg_audit; Type: TRIGGER; Schema: inventario; Owner: -
--

CREATE TRIGGER tipos_catalogos_tg_audit AFTER INSERT OR DELETE OR UPDATE ON tipos_catalogos FOR EACH ROW EXECUTE PROCEDURE public.fun_auditoria();


--
-- TOC entry 2718 (class 2620 OID 48971)
-- Name: tipos_tipo_consumo_tg_audit; Type: TRIGGER; Schema: inventario; Owner: -
--

CREATE TRIGGER tipos_tipo_consumo_tg_audit AFTER INSERT OR DELETE OR UPDATE ON tipos_tipo_consumo FOR EACH ROW EXECUTE PROCEDURE public.fun_auditoria();


--
-- TOC entry 2719 (class 2620 OID 48972)
-- Name: ubicaciones_tg_audit; Type: TRIGGER; Schema: inventario; Owner: -
--

CREATE TRIGGER ubicaciones_tg_audit AFTER INSERT OR DELETE OR UPDATE ON ubicaciones FOR EACH ROW EXECUTE PROCEDURE public.fun_auditoria();


SET search_path = public, pg_catalog;

--
-- TOC entry 2720 (class 2620 OID 48973)
-- Name: estados_tg_audit; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER estados_tg_audit AFTER INSERT OR DELETE OR UPDATE ON estados FOR EACH ROW EXECUTE PROCEDURE fun_auditoria();


--
-- TOC entry 2724 (class 2620 OID 48974)
-- Name: inserta_cliente_tg_usuario; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER inserta_cliente_tg_usuario AFTER INSERT OR DELETE OR UPDATE ON personas_documentos_identificacion FOR EACH ROW EXECUTE PROCEDURE fun_cliente_persona();


--
-- TOC entry 2721 (class 2620 OID 48975)
-- Name: operadoras_telefonicas_tg_audit; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER operadoras_telefonicas_tg_audit AFTER INSERT OR DELETE OR UPDATE ON operadoras_telefonicas FOR EACH ROW EXECUTE PROCEDURE fun_auditoria();


--
-- TOC entry 2723 (class 2620 OID 48976)
-- Name: personas_correo_electronico_tg_audit; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER personas_correo_electronico_tg_audit AFTER INSERT OR DELETE OR UPDATE ON personas_correo_electronico FOR EACH ROW EXECUTE PROCEDURE fun_auditoria();


--
-- TOC entry 2725 (class 2620 OID 48977)
-- Name: personas_documentos_identificacion_tg_audit; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER personas_documentos_identificacion_tg_audit AFTER INSERT OR DELETE OR UPDATE ON personas_documentos_identificacion FOR EACH ROW EXECUTE PROCEDURE fun_auditoria();


--
-- TOC entry 2722 (class 2620 OID 48978)
-- Name: personas_tg_audit; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER personas_tg_audit AFTER INSERT OR DELETE OR UPDATE ON personas FOR EACH ROW EXECUTE PROCEDURE fun_auditoria();


--
-- TOC entry 2726 (class 2620 OID 48979)
-- Name: telefonos_personas_tg_audit; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER telefonos_personas_tg_audit AFTER INSERT OR DELETE OR UPDATE ON telefonos_personas FOR EACH ROW EXECUTE PROCEDURE fun_auditoria();


--
-- TOC entry 2727 (class 2620 OID 48980)
-- Name: tipo_documento_identificacion_tg_audit; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER tipo_documento_identificacion_tg_audit AFTER INSERT OR DELETE OR UPDATE ON tipo_documento_identificacion FOR EACH ROW EXECUTE PROCEDURE fun_auditoria();


SET search_path = talento_humano, pg_catalog;

--
-- TOC entry 2729 (class 2620 OID 48981)
-- Name: cargos_tg_audit; Type: TRIGGER; Schema: talento_humano; Owner: -
--

CREATE TRIGGER cargos_tg_audit AFTER INSERT OR DELETE OR UPDATE ON cargos FOR EACH ROW EXECUTE PROCEDURE public.fun_auditoria();


--
-- TOC entry 2730 (class 2620 OID 48982)
-- Name: empleados_tg_audit; Type: TRIGGER; Schema: talento_humano; Owner: -
--

CREATE TRIGGER empleados_tg_audit AFTER INSERT OR DELETE OR UPDATE ON empleados FOR EACH ROW EXECUTE PROCEDURE public.fun_auditoria();


--
-- TOC entry 2731 (class 2620 OID 48983)
-- Name: jornadas_de_trabajo_tg_audit; Type: TRIGGER; Schema: talento_humano; Owner: -
--

CREATE TRIGGER jornadas_de_trabajo_tg_audit AFTER INSERT OR DELETE OR UPDATE ON jornadas_de_trabajo FOR EACH ROW EXECUTE PROCEDURE public.fun_auditoria();


--
-- TOC entry 2732 (class 2620 OID 48984)
-- Name: tipo_usuario_tg_audit; Type: TRIGGER; Schema: talento_humano; Owner: -
--

CREATE TRIGGER tipo_usuario_tg_audit AFTER INSERT OR DELETE OR UPDATE ON tipos_contratos FOR EACH ROW EXECUTE PROCEDURE public.fun_auditoria();


--
-- TOC entry 2733 (class 2620 OID 48985)
-- Name: tipos_contratos_tg_audit; Type: TRIGGER; Schema: talento_humano; Owner: -
--

CREATE TRIGGER tipos_contratos_tg_audit AFTER INSERT OR DELETE OR UPDATE ON tipos_contratos FOR EACH ROW EXECUTE PROCEDURE public.fun_auditoria();


SET search_path = usuarios, pg_catalog;

--
-- TOC entry 2734 (class 2620 OID 48986)
-- Name: tipo_usuario_tg_audit; Type: TRIGGER; Schema: usuarios; Owner: -
--

CREATE TRIGGER tipo_usuario_tg_audit AFTER INSERT OR DELETE OR UPDATE ON tipo_usuario FOR EACH ROW EXECUTE PROCEDURE public.fun_auditoria();


--
-- TOC entry 2735 (class 2620 OID 48987)
-- Name: usuarios_tg_audit; Type: TRIGGER; Schema: usuarios; Owner: -
--

CREATE TRIGGER usuarios_tg_audit AFTER INSERT OR DELETE OR UPDATE ON usuarios FOR EACH ROW EXECUTE PROCEDURE public.fun_auditoria();


SET search_path = ventas, pg_catalog;

--
-- TOC entry 2736 (class 2620 OID 48988)
-- Name: caja_tg_audit; Type: TRIGGER; Schema: ventas; Owner: -
--

CREATE TRIGGER caja_tg_audit AFTER INSERT OR DELETE OR UPDATE ON caja FOR EACH ROW EXECUTE PROCEDURE public.fun_auditoria();


--
-- TOC entry 2737 (class 2620 OID 48989)
-- Name: caja_usuario_tg_audit; Type: TRIGGER; Schema: ventas; Owner: -
--

CREATE TRIGGER caja_usuario_tg_audit AFTER INSERT OR DELETE OR UPDATE ON caja_usuario FOR EACH ROW EXECUTE PROCEDURE public.fun_auditoria();


--
-- TOC entry 2738 (class 2620 OID 48990)
-- Name: clave_factura_tg_audit; Type: TRIGGER; Schema: ventas; Owner: -
--

CREATE TRIGGER clave_factura_tg_audit AFTER INSERT OR DELETE OR UPDATE ON clave_factura FOR EACH ROW EXECUTE PROCEDURE public.fun_auditoria();


--
-- TOC entry 2739 (class 2620 OID 48991)
-- Name: detalle_factura_tg_audit; Type: TRIGGER; Schema: ventas; Owner: -
--

CREATE TRIGGER detalle_factura_tg_audit AFTER INSERT OR DELETE OR UPDATE ON detalle_factura FOR EACH ROW EXECUTE PROCEDURE public.fun_auditoria();


--
-- TOC entry 2740 (class 2620 OID 48992)
-- Name: empleado_factura_tg_audit; Type: TRIGGER; Schema: ventas; Owner: -
--

CREATE TRIGGER empleado_factura_tg_audit AFTER INSERT OR DELETE OR UPDATE ON empleado_factura FOR EACH ROW EXECUTE PROCEDURE public.fun_auditoria();


--
-- TOC entry 2741 (class 2620 OID 48993)
-- Name: facturas_tg_audit; Type: TRIGGER; Schema: ventas; Owner: -
--

CREATE TRIGGER facturas_tg_audit AFTER INSERT OR DELETE OR UPDATE ON facturas FOR EACH ROW EXECUTE PROCEDURE public.fun_auditoria();


--
-- TOC entry 2742 (class 2620 OID 48994)
-- Name: formas_pago_facturas_tg_audit; Type: TRIGGER; Schema: ventas; Owner: -
--

CREATE TRIGGER formas_pago_facturas_tg_audit AFTER INSERT OR DELETE OR UPDATE ON formas_pago_facturas FOR EACH ROW EXECUTE PROCEDURE public.fun_auditoria();


--
-- TOC entry 2728 (class 2620 OID 48995)
-- Name: formas_pago_tg_audit; Type: TRIGGER; Schema: ventas; Owner: -
--

CREATE TRIGGER formas_pago_tg_audit AFTER INSERT OR DELETE OR UPDATE ON formas_pago FOR EACH ROW EXECUTE PROCEDURE public.fun_auditoria();


--
-- TOC entry 2743 (class 2620 OID 48996)
-- Name: producto_descuento_tg_audit; Type: TRIGGER; Schema: ventas; Owner: -
--

CREATE TRIGGER producto_descuento_tg_audit AFTER INSERT OR DELETE OR UPDATE ON producto_descuento FOR EACH ROW EXECUTE PROCEDURE public.fun_auditoria();


SET search_path = administracion, pg_catalog;

--
-- TOC entry 2598 (class 2606 OID 48997)
-- Name: estado; Type: FK CONSTRAINT; Schema: administracion; Owner: -
--

ALTER TABLE ONLY tipo_empresa
    ADD CONSTRAINT estado FOREIGN KEY (estado) REFERENCES public.estados(id);


--
-- TOC entry 2593 (class 2606 OID 49002)
-- Name: estado; Type: FK CONSTRAINT; Schema: administracion; Owner: -
--

ALTER TABLE ONLY clientes
    ADD CONSTRAINT estado FOREIGN KEY (estado) REFERENCES public.estados(id);


--
-- TOC entry 2597 (class 2606 OID 49007)
-- Name: estado_FK; Type: FK CONSTRAINT; Schema: administracion; Owner: -
--

ALTER TABLE ONLY tipo_bienes_servicios
    ADD CONSTRAINT "estado_FK" FOREIGN KEY (estado) REFERENCES public.estados(id);


--
-- TOC entry 2591 (class 2606 OID 49012)
-- Name: estado_FK; Type: FK CONSTRAINT; Schema: administracion; Owner: -
--

ALTER TABLE ONLY actividad_economica
    ADD CONSTRAINT "estado_FK" FOREIGN KEY (estado) REFERENCES public.estados(id);


--
-- TOC entry 2600 (class 2606 OID 49017)
-- Name: estado_FK; Type: FK CONSTRAINT; Schema: administracion; Owner: -
--

ALTER TABLE ONLY usuarios_privilegios
    ADD CONSTRAINT "estado_FK" FOREIGN KEY (estado) REFERENCES public.estados(id);


--
-- TOC entry 2599 (class 2606 OID 49022)
-- Name: estado_FK; Type: FK CONSTRAINT; Schema: administracion; Owner: -
--

ALTER TABLE ONLY tipos_imagenes_empresas
    ADD CONSTRAINT "estado_FK" FOREIGN KEY (estado) REFERENCES public.estados(id);


--
-- TOC entry 2594 (class 2606 OID 49027)
-- Name: estado_empresa_FK; Type: FK CONSTRAINT; Schema: administracion; Owner: -
--

ALTER TABLE ONLY empresas
    ADD CONSTRAINT "estado_empresa_FK" FOREIGN KEY (id_estado) REFERENCES public.estados(id);


--
-- TOC entry 2595 (class 2606 OID 49032)
-- Name: imagen_empresa_estado_FK; Type: FK CONSTRAINT; Schema: administracion; Owner: -
--

ALTER TABLE ONLY imagen_empresa
    ADD CONSTRAINT "imagen_empresa_estado_FK" FOREIGN KEY (estado) REFERENCES public.estados(id);


--
-- TOC entry 2592 (class 2606 OID 49037)
-- Name: tipo_bienes_servicios_FK; Type: FK CONSTRAINT; Schema: administracion; Owner: -
--

ALTER TABLE ONLY actividad_economica
    ADD CONSTRAINT "tipo_bienes_servicios_FK" FOREIGN KEY (id_tipo_bienes_servicios) REFERENCES tipo_bienes_servicios(id);


--
-- TOC entry 2596 (class 2606 OID 49042)
-- Name: tipo_imagen_empresa_FK; Type: FK CONSTRAINT; Schema: administracion; Owner: -
--

ALTER TABLE ONLY imagen_empresa
    ADD CONSTRAINT "tipo_imagen_empresa_FK" FOREIGN KEY (tipo_imagen) REFERENCES tipos_imagenes_empresas(id);


--
-- TOC entry 2601 (class 2606 OID 49047)
-- Name: usuario_privilegios_tipo_accion_vista_FK; Type: FK CONSTRAINT; Schema: administracion; Owner: -
--

ALTER TABLE ONLY usuarios_privilegios
    ADD CONSTRAINT "usuario_privilegios_tipo_accion_vista_FK" FOREIGN KEY (id_tipo_accion_vistas) REFERENCES tipo_accion_vista(id);


--
-- TOC entry 2602 (class 2606 OID 49052)
-- Name: usuario_privilegios_tipo_usuario_FK; Type: FK CONSTRAINT; Schema: administracion; Owner: -
--

ALTER TABLE ONLY usuarios_privilegios
    ADD CONSTRAINT "usuario_privilegios_tipo_usuario_FK" FOREIGN KEY (id_tipo_usuario) REFERENCES usuarios.tipo_usuario(id);


SET search_path = contabilidad, pg_catalog;

--
-- TOC entry 2614 (class 2606 OID 49057)
-- Name: ambito_FK; Type: FK CONSTRAINT; Schema: contabilidad; Owner: -
--

ALTER TABLE ONLY impuestos
    ADD CONSTRAINT "ambito_FK" FOREIGN KEY (ambito) REFERENCES ambitos_impuestos(id);


--
-- TOC entry 2613 (class 2606 OID 49062)
-- Name: estado_FK; Type: FK CONSTRAINT; Schema: contabilidad; Owner: -
--

ALTER TABLE ONLY grupo_impuestos
    ADD CONSTRAINT "estado_FK" FOREIGN KEY (estado) REFERENCES public.estados(id);


--
-- TOC entry 2603 (class 2606 OID 49067)
-- Name: estado_FK; Type: FK CONSTRAINT; Schema: contabilidad; Owner: -
--

ALTER TABLE ONLY ambitos_impuestos
    ADD CONSTRAINT "estado_FK" FOREIGN KEY (estado) REFERENCES public.estados(id);


--
-- TOC entry 2615 (class 2606 OID 49072)
-- Name: estado_FK; Type: FK CONSTRAINT; Schema: contabilidad; Owner: -
--

ALTER TABLE ONLY impuestos
    ADD CONSTRAINT "estado_FK" FOREIGN KEY (estado) REFERENCES public.estados(id);


--
-- TOC entry 2604 (class 2606 OID 49077)
-- Name: estado_asiento_contable_FK; Type: FK CONSTRAINT; Schema: contabilidad; Owner: -
--

ALTER TABLE ONLY asientos_contables_diario
    ADD CONSTRAINT "estado_asiento_contable_FK" FOREIGN KEY (estado) REFERENCES public.estados(id);


--
-- TOC entry 2605 (class 2606 OID 49082)
-- Name: estado_bancos_FK; Type: FK CONSTRAINT; Schema: contabilidad; Owner: -
--

ALTER TABLE ONLY bancos
    ADD CONSTRAINT "estado_bancos_FK" FOREIGN KEY (estado) REFERENCES public.estados(id);


--
-- TOC entry 2617 (class 2606 OID 49087)
-- Name: estado_factura; Type: FK CONSTRAINT; Schema: contabilidad; Owner: -
--

ALTER TABLE ONLY repositorio_facturas
    ADD CONSTRAINT estado_factura FOREIGN KEY (estado) REFERENCES public.estados(id);


--
-- TOC entry 2608 (class 2606 OID 49092)
-- Name: estado_pago; Type: FK CONSTRAINT; Schema: contabilidad; Owner: -
--

ALTER TABLE ONLY finaciaminto
    ADD CONSTRAINT estado_pago FOREIGN KEY (estado_pago) REFERENCES public.estados(id);


--
-- TOC entry 2621 (class 2606 OID 49097)
-- Name: estado_tipo_cuenta_contable_FK; Type: FK CONSTRAINT; Schema: contabilidad; Owner: -
--

ALTER TABLE ONLY tipos_cuentas_contables
    ADD CONSTRAINT "estado_tipo_cuenta_contable_FK" FOREIGN KEY (estado) REFERENCES public.estados(id);


--
-- TOC entry 2622 (class 2606 OID 49102)
-- Name: estado_tipo_documento_FK; Type: FK CONSTRAINT; Schema: contabilidad; Owner: -
--

ALTER TABLE ONLY tipo_documentos
    ADD CONSTRAINT "estado_tipo_documento_FK" FOREIGN KEY (estado) REFERENCES public.estados(id);


--
-- TOC entry 2623 (class 2606 OID 49107)
-- Name: estado_tipo_impuesto_FK; Type: FK CONSTRAINT; Schema: contabilidad; Owner: -
--

ALTER TABLE ONLY tipo_impuestos
    ADD CONSTRAINT "estado_tipo_impuesto_FK" FOREIGN KEY (estado) REFERENCES public.estados(id);


--
-- TOC entry 2618 (class 2606 OID 49112)
-- Name: estado_ver_factura; Type: FK CONSTRAINT; Schema: contabilidad; Owner: -
--

ALTER TABLE ONLY repositorio_facturas
    ADD CONSTRAINT estado_ver_factura FOREIGN KEY (estado_view) REFERENCES public.estados(id);


--
-- TOC entry 2609 (class 2606 OID 49117)
-- Name: factura_finaciamiento_FK; Type: FK CONSTRAINT; Schema: contabilidad; Owner: -
--

ALTER TABLE ONLY finaciaminto
    ADD CONSTRAINT "factura_finaciamiento_FK" FOREIGN KEY (id_factura) REFERENCES ventas.facturas(id);


--
-- TOC entry 2611 (class 2606 OID 49122)
-- Name: gastos_impueto_renta_deducion_estado; Type: FK CONSTRAINT; Schema: contabilidad; Owner: -
--

ALTER TABLE ONLY gastos_impuestos_renta_deduccion
    ADD CONSTRAINT gastos_impueto_renta_deducion_estado FOREIGN KEY (estado) REFERENCES public.estados(id);


--
-- TOC entry 2612 (class 2606 OID 49127)
-- Name: gastos_impueto_renta_deducion_factura; Type: FK CONSTRAINT; Schema: contabilidad; Owner: -
--

ALTER TABLE ONLY gastos_impuestos_renta_deduccion
    ADD CONSTRAINT gastos_impueto_renta_deducion_factura FOREIGN KEY (id_factura) REFERENCES repositorio_facturas(id_factura);


--
-- TOC entry 2620 (class 2606 OID 49132)
-- Name: id_empleasdo_FK; Type: FK CONSTRAINT; Schema: contabilidad; Owner: -
--

ALTER TABLE ONLY rol_pagos_empleados
    ADD CONSTRAINT "id_empleasdo_FK" FOREIGN KEY (id_empleado) REFERENCES talento_humano.empleados(id);


--
-- TOC entry 2606 (class 2606 OID 49137)
-- Name: persona_bancos_FK; Type: FK CONSTRAINT; Schema: contabilidad; Owner: -
--

ALTER TABLE ONLY bancos
    ADD CONSTRAINT "persona_bancos_FK" FOREIGN KEY (titular_cuenta) REFERENCES public.personas(id);


--
-- TOC entry 2610 (class 2606 OID 49142)
-- Name: plazos_credito_FK; Type: FK CONSTRAINT; Schema: contabilidad; Owner: -
--

ALTER TABLE ONLY finaciaminto
    ADD CONSTRAINT "plazos_credito_FK" FOREIGN KEY (id_plazos_credito) REFERENCES plazos_credito(id);


--
-- TOC entry 2619 (class 2606 OID 49147)
-- Name: repositorio_facturas_rechazadas_estado_fkey; Type: FK CONSTRAINT; Schema: contabilidad; Owner: -
--

ALTER TABLE ONLY repositorio_facturas_rechazadas
    ADD CONSTRAINT repositorio_facturas_rechazadas_estado_fkey FOREIGN KEY (estado) REFERENCES public.estados(id);


--
-- TOC entry 2607 (class 2606 OID 49152)
-- Name: tipo_cuenta_cuentas_contables_FK; Type: FK CONSTRAINT; Schema: contabilidad; Owner: -
--

ALTER TABLE ONLY cuentas_contables
    ADD CONSTRAINT "tipo_cuenta_cuentas_contables_FK" FOREIGN KEY (tipo_cuenta) REFERENCES tipos_cuentas_contables(id);


--
-- TOC entry 2616 (class 2606 OID 49157)
-- Name: tipo_impuesto; Type: FK CONSTRAINT; Schema: contabilidad; Owner: -
--

ALTER TABLE ONLY impuestos
    ADD CONSTRAINT tipo_impuesto FOREIGN KEY (tipo_impuesto) REFERENCES tipo_impuestos(id);


SET search_path = inventario, pg_catalog;

--
-- TOC entry 2639 (class 2606 OID 49162)
-- Name: bodega_FK; Type: FK CONSTRAINT; Schema: inventario; Owner: -
--

ALTER TABLE ONLY productos
    ADD CONSTRAINT "bodega_FK" FOREIGN KEY (bodega) REFERENCES bodegas(id);


--
-- TOC entry 2640 (class 2606 OID 49167)
-- Name: categoria_FK; Type: FK CONSTRAINT; Schema: inventario; Owner: -
--

ALTER TABLE ONLY productos
    ADD CONSTRAINT "categoria_FK" FOREIGN KEY (categoria) REFERENCES categorias(id);


--
-- TOC entry 2651 (class 2606 OID 49172)
-- Name: estado_FK; Type: FK CONSTRAINT; Schema: inventario; Owner: -
--

ALTER TABLE ONLY tipos_imagenes_productos
    ADD CONSTRAINT "estado_FK" FOREIGN KEY (estado) REFERENCES public.estados(id);


--
-- TOC entry 2632 (class 2606 OID 49177)
-- Name: estado_FK; Type: FK CONSTRAINT; Schema: inventario; Owner: -
--

ALTER TABLE ONLY imagenes_productos
    ADD CONSTRAINT "estado_FK" FOREIGN KEY (estado) REFERENCES public.estados(id);


--
-- TOC entry 2630 (class 2606 OID 49182)
-- Name: estado_FK; Type: FK CONSTRAINT; Schema: inventario; Owner: -
--

ALTER TABLE ONLY garantias
    ADD CONSTRAINT "estado_FK" FOREIGN KEY (estado) REFERENCES public.estados(id);


--
-- TOC entry 2649 (class 2606 OID 49187)
-- Name: estado_FK; Type: FK CONSTRAINT; Schema: inventario; Owner: -
--

ALTER TABLE ONLY tipos_categorias
    ADD CONSTRAINT "estado_FK" FOREIGN KEY (estado) REFERENCES public.estados(id);


--
-- TOC entry 2637 (class 2606 OID 49192)
-- Name: estado_FK; Type: FK CONSTRAINT; Schema: inventario; Owner: -
--

ALTER TABLE ONLY marcas
    ADD CONSTRAINT "estado_FK" FOREIGN KEY (estado) REFERENCES public.estados(id);


--
-- TOC entry 2638 (class 2606 OID 49197)
-- Name: estado_FK; Type: FK CONSTRAINT; Schema: inventario; Owner: -
--

ALTER TABLE ONLY modelos
    ADD CONSTRAINT "estado_FK" FOREIGN KEY (estado) REFERENCES public.estados(id);


--
-- TOC entry 2629 (class 2606 OID 49202)
-- Name: estado_FK; Type: FK CONSTRAINT; Schema: inventario; Owner: -
--

ALTER TABLE ONLY estado_descriptivo
    ADD CONSTRAINT "estado_FK" FOREIGN KEY (estado) REFERENCES public.estados(id);


--
-- TOC entry 2652 (class 2606 OID 49207)
-- Name: estado_FK; Type: FK CONSTRAINT; Schema: inventario; Owner: -
--

ALTER TABLE ONLY tipos_productos
    ADD CONSTRAINT "estado_FK" FOREIGN KEY (estado) REFERENCES public.estados(id);


--
-- TOC entry 2648 (class 2606 OID 49212)
-- Name: estado_FK; Type: FK CONSTRAINT; Schema: inventario; Owner: -
--

ALTER TABLE ONLY tipos_catalogos
    ADD CONSTRAINT "estado_FK" FOREIGN KEY (estado) REFERENCES public.estados(id);


--
-- TOC entry 2653 (class 2606 OID 49217)
-- Name: estado_FK; Type: FK CONSTRAINT; Schema: inventario; Owner: -
--

ALTER TABLE ONLY tipos_tipo_consumo
    ADD CONSTRAINT "estado_FK" FOREIGN KEY (estado) REFERENCES public.estados(id);


--
-- TOC entry 2654 (class 2606 OID 49222)
-- Name: estado_FK; Type: FK CONSTRAINT; Schema: inventario; Owner: -
--

ALTER TABLE ONLY ubicaciones
    ADD CONSTRAINT "estado_FK" FOREIGN KEY (estado) REFERENCES public.estados(id);


--
-- TOC entry 2635 (class 2606 OID 49227)
-- Name: estado_FK; Type: FK CONSTRAINT; Schema: inventario; Owner: -
--

ALTER TABLE ONLY manejo_presios
    ADD CONSTRAINT "estado_FK" FOREIGN KEY (estado) REFERENCES public.estados(id);


--
-- TOC entry 2624 (class 2606 OID 49232)
-- Name: estado_bodega_FK; Type: FK CONSTRAINT; Schema: inventario; Owner: -
--

ALTER TABLE ONLY bodegas
    ADD CONSTRAINT "estado_bodega_FK" FOREIGN KEY (estado) REFERENCES public.estados(id);


--
-- TOC entry 2641 (class 2606 OID 49237)
-- Name: estado_descriptivo_FK; Type: FK CONSTRAINT; Schema: inventario; Owner: -
--

ALTER TABLE ONLY productos
    ADD CONSTRAINT "estado_descriptivo_FK" FOREIGN KEY (estado_descriptivo) REFERENCES estado_descriptivo(id);


--
-- TOC entry 2650 (class 2606 OID 49242)
-- Name: estados; Type: FK CONSTRAINT; Schema: inventario; Owner: -
--

ALTER TABLE ONLY tipos_garantias
    ADD CONSTRAINT estados FOREIGN KEY (estado) REFERENCES public.estados(id);


--
-- TOC entry 2642 (class 2606 OID 49247)
-- Name: garantia_FK; Type: FK CONSTRAINT; Schema: inventario; Owner: -
--

ALTER TABLE ONLY productos
    ADD CONSTRAINT "garantia_FK" FOREIGN KEY (garantia) REFERENCES garantias(id);


--
-- TOC entry 2625 (class 2606 OID 49252)
-- Name: giro_negocio_FK; Type: FK CONSTRAINT; Schema: inventario; Owner: -
--

ALTER TABLE ONLY bodegas
    ADD CONSTRAINT "giro_negocio_FK" FOREIGN KEY (giro_negocio) REFERENCES administracion.tipo_bienes_servicios(id);


--
-- TOC entry 2628 (class 2606 OID 49257)
-- Name: id_producto; Type: FK CONSTRAINT; Schema: inventario; Owner: -
--

ALTER TABLE ONLY descripcion_producto
    ADD CONSTRAINT id_producto FOREIGN KEY (producto) REFERENCES productos(id);


--
-- TOC entry 2636 (class 2606 OID 49262)
-- Name: id_producto; Type: FK CONSTRAINT; Schema: inventario; Owner: -
--

ALTER TABLE ONLY manejo_presios
    ADD CONSTRAINT id_producto FOREIGN KEY (id_producto) REFERENCES productos(id);


--
-- TOC entry 2633 (class 2606 OID 49267)
-- Name: id_producto_FK; Type: FK CONSTRAINT; Schema: inventario; Owner: -
--

ALTER TABLE ONLY imagenes_productos
    ADD CONSTRAINT "id_producto_FK" FOREIGN KEY (producto) REFERENCES productos(id);


--
-- TOC entry 2647 (class 2606 OID 49272)
-- Name: impuesto_FK; Type: FK CONSTRAINT; Schema: inventario; Owner: -
--

ALTER TABLE ONLY productos_impuestos
    ADD CONSTRAINT "impuesto_FK" FOREIGN KEY (impuesto) REFERENCES contabilidad.impuestos(id);


--
-- TOC entry 2643 (class 2606 OID 49277)
-- Name: marca_FK; Type: FK CONSTRAINT; Schema: inventario; Owner: -
--

ALTER TABLE ONLY productos
    ADD CONSTRAINT "marca_FK" FOREIGN KEY (marca) REFERENCES marcas(id);


--
-- TOC entry 2644 (class 2606 OID 49282)
-- Name: modelo_FK; Type: FK CONSTRAINT; Schema: inventario; Owner: -
--

ALTER TABLE ONLY productos
    ADD CONSTRAINT "modelo_FK" FOREIGN KEY (modelo) REFERENCES modelos(id);


--
-- TOC entry 2645 (class 2606 OID 49287)
-- Name: producto_tipo_consumo_FK; Type: FK CONSTRAINT; Schema: inventario; Owner: -
--

ALTER TABLE ONLY productos
    ADD CONSTRAINT "producto_tipo_consumo_FK" FOREIGN KEY (tipo_consumo) REFERENCES tipo_consumo(id);


--
-- TOC entry 2626 (class 2606 OID 49292)
-- Name: tipo_catalogo_FK; Type: FK CONSTRAINT; Schema: inventario; Owner: -
--

ALTER TABLE ONLY catalogos
    ADD CONSTRAINT "tipo_catalogo_FK" FOREIGN KEY (tipo_catalogo) REFERENCES tipos_catalogos(id);


--
-- TOC entry 2627 (class 2606 OID 49297)
-- Name: tipo_categoria_FK; Type: FK CONSTRAINT; Schema: inventario; Owner: -
--

ALTER TABLE ONLY categorias
    ADD CONSTRAINT "tipo_categoria_FK" FOREIGN KEY (tipo_categoria) REFERENCES tipos_categorias(id);


--
-- TOC entry 2631 (class 2606 OID 49302)
-- Name: tipo_garantia_FK; Type: FK CONSTRAINT; Schema: inventario; Owner: -
--

ALTER TABLE ONLY garantias
    ADD CONSTRAINT "tipo_garantia_FK" FOREIGN KEY (tipo_garantia) REFERENCES tipos_garantias(id);


--
-- TOC entry 2634 (class 2606 OID 49307)
-- Name: tipo_imagen_producto; Type: FK CONSTRAINT; Schema: inventario; Owner: -
--

ALTER TABLE ONLY imagenes_productos
    ADD CONSTRAINT tipo_imagen_producto FOREIGN KEY (tipo_imagen) REFERENCES tipos_imagenes_productos(id);


--
-- TOC entry 2646 (class 2606 OID 49312)
-- Name: ubicacion_FK; Type: FK CONSTRAINT; Schema: inventario; Owner: -
--

ALTER TABLE ONLY productos
    ADD CONSTRAINT "ubicacion_FK" FOREIGN KEY (ubicacion) REFERENCES ubicaciones(id);


SET search_path = public, pg_catalog;

--
-- TOC entry 2662 (class 2606 OID 49317)
-- Name: estado_FK; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY tipo_documento_identificacion
    ADD CONSTRAINT "estado_FK" FOREIGN KEY (estado) REFERENCES estados(id);


--
-- TOC entry 2655 (class 2606 OID 49322)
-- Name: estado_FK; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY operadoras_telefonicas
    ADD CONSTRAINT "estado_FK" FOREIGN KEY (estado) REFERENCES estados(id);


--
-- TOC entry 2657 (class 2606 OID 49327)
-- Name: estado_FK; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY personas_documentos_identificacion
    ADD CONSTRAINT "estado_FK" FOREIGN KEY (estado) REFERENCES estados(id);


--
-- TOC entry 2656 (class 2606 OID 49332)
-- Name: estado_FK; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY personas_correo_electronico
    ADD CONSTRAINT "estado_FK" FOREIGN KEY (estado) REFERENCES estados(id);


--
-- TOC entry 2660 (class 2606 OID 49337)
-- Name: id_persona_FK; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY telefonos_personas
    ADD CONSTRAINT "id_persona_FK" FOREIGN KEY (id_persona) REFERENCES personas(id);


--
-- TOC entry 2658 (class 2606 OID 49342)
-- Name: persona_FK; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY personas_documentos_identificacion
    ADD CONSTRAINT "persona_FK" FOREIGN KEY (id_persona) REFERENCES personas(id);


--
-- TOC entry 2661 (class 2606 OID 49347)
-- Name: telefonos_personas_operadora_telefocnica_FK; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY telefonos_personas
    ADD CONSTRAINT "telefonos_personas_operadora_telefocnica_FK" FOREIGN KEY (id_operadora_telefonica) REFERENCES operadoras_telefonicas(id);


--
-- TOC entry 2659 (class 2606 OID 49352)
-- Name: tipo_documento_FK; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY personas_documentos_identificacion
    ADD CONSTRAINT "tipo_documento_FK" FOREIGN KEY (id_tipo_documento) REFERENCES tipo_documento_identificacion(id);


SET search_path = talento_humano, pg_catalog;

--
-- TOC entry 2668 (class 2606 OID 49357)
-- Name: estado; Type: FK CONSTRAINT; Schema: talento_humano; Owner: -
--

ALTER TABLE ONLY tipos_contratos
    ADD CONSTRAINT estado FOREIGN KEY (estado) REFERENCES public.estados(id);


--
-- TOC entry 2664 (class 2606 OID 49362)
-- Name: estado_empleado_FK; Type: FK CONSTRAINT; Schema: talento_humano; Owner: -
--

ALTER TABLE ONLY empleados
    ADD CONSTRAINT "estado_empleado_FK" FOREIGN KEY (estado) REFERENCES public.estados(id);


--
-- TOC entry 2665 (class 2606 OID 49367)
-- Name: id_cargo_FK; Type: FK CONSTRAINT; Schema: talento_humano; Owner: -
--

ALTER TABLE ONLY empleados
    ADD CONSTRAINT "id_cargo_FK" FOREIGN KEY (id_cargo) REFERENCES administracion.empresas(id);


--
-- TOC entry 2666 (class 2606 OID 49372)
-- Name: id_persona_empleado_FK; Type: FK CONSTRAINT; Schema: talento_humano; Owner: -
--

ALTER TABLE ONLY empleados
    ADD CONSTRAINT "id_persona_empleado_FK" FOREIGN KEY (id_persona) REFERENCES public.personas(id);


--
-- TOC entry 2667 (class 2606 OID 49377)
-- Name: id_usuario_empleado_FK; Type: FK CONSTRAINT; Schema: talento_humano; Owner: -
--

ALTER TABLE ONLY empleados
    ADD CONSTRAINT "id_usuario_empleado_FK" FOREIGN KEY (id_usuario) REFERENCES usuarios.usuarios(id);


SET search_path = usuarios, pg_catalog;

--
-- TOC entry 2669 (class 2606 OID 49382)
-- Name: estado_FK; Type: FK CONSTRAINT; Schema: usuarios; Owner: -
--

ALTER TABLE ONLY tipo_usuario
    ADD CONSTRAINT "estado_FK" FOREIGN KEY (estado) REFERENCES public.estados(id);


SET search_path = ventas, pg_catalog;

--
-- TOC entry 2675 (class 2606 OID 49387)
-- Name: factura_estado_FK; Type: FK CONSTRAINT; Schema: ventas; Owner: -
--

ALTER TABLE ONLY facturas
    ADD CONSTRAINT "factura_estado_FK" FOREIGN KEY (estado) REFERENCES public.estados(id);


--
-- TOC entry 2663 (class 2606 OID 49392)
-- Name: forma_pago_estado_FK; Type: FK CONSTRAINT; Schema: ventas; Owner: -
--

ALTER TABLE ONLY formas_pago
    ADD CONSTRAINT "forma_pago_estado_FK" FOREIGN KEY (estado) REFERENCES public.estados(id);


--
-- TOC entry 2670 (class 2606 OID 49397)
-- Name: id_caja_FK; Type: FK CONSTRAINT; Schema: ventas; Owner: -
--

ALTER TABLE ONLY caja_usuario
    ADD CONSTRAINT "id_caja_FK" FOREIGN KEY (id_caja) REFERENCES caja(id);


--
-- TOC entry 2674 (class 2606 OID 49402)
-- Name: id_empleado; Type: FK CONSTRAINT; Schema: ventas; Owner: -
--

ALTER TABLE ONLY empleado_factura
    ADD CONSTRAINT id_empleado FOREIGN KEY (id_empleado) REFERENCES talento_humano.empleados(id);


--
-- TOC entry 2671 (class 2606 OID 49407)
-- Name: id_empleado_FK; Type: FK CONSTRAINT; Schema: ventas; Owner: -
--

ALTER TABLE ONLY caja_usuario
    ADD CONSTRAINT "id_empleado_FK" FOREIGN KEY (id_empleado) REFERENCES talento_humano.empleados(id);


--
-- TOC entry 2673 (class 2606 OID 49412)
-- Name: id_factura_FK; Type: FK CONSTRAINT; Schema: ventas; Owner: -
--

ALTER TABLE ONLY clave_factura
    ADD CONSTRAINT "id_factura_FK" FOREIGN KEY (id_factura) REFERENCES facturas(id);


--
-- TOC entry 2672 (class 2606 OID 49417)
-- Name: id_usuario_FK; Type: FK CONSTRAINT; Schema: ventas; Owner: -
--

ALTER TABLE ONLY caja_usuario
    ADD CONSTRAINT "id_usuario_FK" FOREIGN KEY (id_usuario) REFERENCES usuarios.usuarios(id);


--
-- TOC entry 2676 (class 2606 OID 49422)
-- Name: producto_catalogo_catalogo; Type: FK CONSTRAINT; Schema: ventas; Owner: -
--

ALTER TABLE ONLY producto_descuento
    ADD CONSTRAINT producto_catalogo_catalogo FOREIGN KEY (id_catalogo) REFERENCES inventario.catalogos(id);


-- Completed on 2017-10-24 09:57:30

--
-- PostgreSQL database dump complete
--

