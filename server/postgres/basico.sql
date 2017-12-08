--
-- PostgreSQL database dump
--

-- Dumped from database version 9.5.10
-- Dumped by pg_dump version 9.5.10

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: administracion; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA administracion;


ALTER SCHEMA administracion OWNER TO postgres;

--
-- Name: auditoria; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA auditoria;


ALTER SCHEMA auditoria OWNER TO postgres;

--
-- Name: SCHEMA auditoria; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON SCHEMA auditoria IS 'auditoria de los cambios en la bd';


--
-- Name: contabilidad; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA contabilidad;


ALTER SCHEMA contabilidad OWNER TO postgres;

--
-- Name: inventario; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA inventario;


ALTER SCHEMA inventario OWNER TO postgres;

--
-- Name: talento_humano; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA talento_humano;


ALTER SCHEMA talento_humano OWNER TO postgres;

--
-- Name: taller_mecanico; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA taller_mecanico;


ALTER SCHEMA taller_mecanico OWNER TO postgres;

--
-- Name: usuarios; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA usuarios;


ALTER SCHEMA usuarios OWNER TO postgres;

--
-- Name: ventas; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA ventas;


ALTER SCHEMA ventas OWNER TO postgres;

--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET search_path = public, pg_catalog;

--
-- Name: f_convnl(numeric); Type: FUNCTION; Schema: public; Owner: postgres
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


ALTER FUNCTION public.f_convnl(num numeric) OWNER TO postgres;

--
-- Name: fun_auditoria(); Type: FUNCTION; Schema: public; Owner: postgres
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


ALTER FUNCTION public.fun_auditoria() OWNER TO postgres;

--
-- Name: fun_cliente_empresa(); Type: FUNCTION; Schema: public; Owner: postgres
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


ALTER FUNCTION public.fun_cliente_empresa() OWNER TO postgres;

--
-- Name: fun_cliente_persona(); Type: FUNCTION; Schema: public; Owner: postgres
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


ALTER FUNCTION public.fun_cliente_persona() OWNER TO postgres;

SET search_path = usuarios, pg_catalog;

--
-- Name: actualiza_clave(character varying, character varying); Type: FUNCTION; Schema: usuarios; Owner: postgres
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


ALTER FUNCTION usuarios.actualiza_clave(iden character varying, contra character varying) OWNER TO postgres;

SET search_path = administracion, pg_catalog;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: actividad_economica; Type: TABLE; Schema: administracion; Owner: postgres
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


ALTER TABLE actividad_economica OWNER TO postgres;

--
-- Name: actividad_economica_id_seq; Type: SEQUENCE; Schema: administracion; Owner: postgres
--

CREATE SEQUENCE actividad_economica_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE actividad_economica_id_seq OWNER TO postgres;

--
-- Name: actividad_economica_id_seq; Type: SEQUENCE OWNED BY; Schema: administracion; Owner: postgres
--

ALTER SEQUENCE actividad_economica_id_seq OWNED BY actividad_economica.id;


--
-- Name: clientes; Type: TABLE; Schema: administracion; Owner: postgres
--

CREATE TABLE clientes (
    id character varying(50) NOT NULL,
    tipo_cliente integer NOT NULL,
    id_cliente integer NOT NULL,
    id_tipo_documento integer NOT NULL,
    fecha timestamp without time zone DEFAULT now() NOT NULL,
    estado character varying NOT NULL
);


ALTER TABLE clientes OWNER TO postgres;

--
-- Name: empresas; Type: TABLE; Schema: administracion; Owner: postgres
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


ALTER TABLE empresas OWNER TO postgres;

--
-- Name: COLUMN empresas.id; Type: COMMENT; Schema: administracion; Owner: postgres
--

COMMENT ON COLUMN empresas.id IS 'define el identificador de la empresa';


--
-- Name: COLUMN empresas.razon_social; Type: COMMENT; Schema: administracion; Owner: postgres
--

COMMENT ON COLUMN empresas.razon_social IS 'define la razon social de la empresa';


--
-- Name: COLUMN empresas.actividad_economica; Type: COMMENT; Schema: administracion; Owner: postgres
--

COMMENT ON COLUMN empresas.actividad_economica IS 'actividad economica que realiza la empresa';


--
-- Name: COLUMN empresas.ruc_ci; Type: COMMENT; Schema: administracion; Owner: postgres
--

COMMENT ON COLUMN empresas.ruc_ci IS 'ruc o cedula dependiendo el tipo de usuario';


--
-- Name: COLUMN empresas.nombre_comercial; Type: COMMENT; Schema: administracion; Owner: postgres
--

COMMENT ON COLUMN empresas.nombre_comercial IS 'nombre con el que se le conoce a la empresa';


--
-- Name: COLUMN empresas.tipo_persona; Type: COMMENT; Schema: administracion; Owner: postgres
--

COMMENT ON COLUMN empresas.tipo_persona IS 'tipo de persona natural o juridica segun SRI';


--
-- Name: COLUMN empresas.id_estado; Type: COMMENT; Schema: administracion; Owner: postgres
--

COMMENT ON COLUMN empresas.id_estado IS 'define el estado de la empresa para el sistema Nexbook';


--
-- Name: empresas_id_seq; Type: SEQUENCE; Schema: administracion; Owner: postgres
--

CREATE SEQUENCE empresas_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE empresas_id_seq OWNER TO postgres;

--
-- Name: empresas_id_seq; Type: SEQUENCE OWNED BY; Schema: administracion; Owner: postgres
--

ALTER SEQUENCE empresas_id_seq OWNED BY empresas.id;


--
-- Name: imagen_empresa; Type: TABLE; Schema: administracion; Owner: postgres
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


ALTER TABLE imagen_empresa OWNER TO postgres;

--
-- Name: imagen_empresa_id_seq; Type: SEQUENCE; Schema: administracion; Owner: postgres
--

CREATE SEQUENCE imagen_empresa_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE imagen_empresa_id_seq OWNER TO postgres;

--
-- Name: imagen_empresa_id_seq; Type: SEQUENCE OWNED BY; Schema: administracion; Owner: postgres
--

ALTER SEQUENCE imagen_empresa_id_seq OWNED BY imagen_empresa.id;


--
-- Name: informacion_empresa_tbl; Type: TABLE; Schema: administracion; Owner: postgres
--

CREATE TABLE informacion_empresa_tbl (
    id integer NOT NULL,
    id_empresa integer NOT NULL,
    id_tipo_empresa integer NOT NULL,
    id_sucursal integer NOT NULL,
    mision text,
    vision text,
    slogan character varying(2500),
    valores_institucionales json,
    telefonos json,
    correos json,
    estado character varying(5) NOT NULL,
    fecha_creacion timestamp without time zone DEFAULT now() NOT NULL,
    fecha_ultimo_cambio timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE informacion_empresa_tbl OWNER TO postgres;

--
-- Name: informacion_empresa_tbl_id_seq; Type: SEQUENCE; Schema: administracion; Owner: postgres
--

CREATE SEQUENCE informacion_empresa_tbl_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE informacion_empresa_tbl_id_seq OWNER TO postgres;

--
-- Name: informacion_empresa_tbl_id_seq; Type: SEQUENCE OWNED BY; Schema: administracion; Owner: postgres
--

ALTER SEQUENCE informacion_empresa_tbl_id_seq OWNED BY informacion_empresa_tbl.id;


--
-- Name: sucursal_actividad_economica_tbl; Type: TABLE; Schema: administracion; Owner: postgres
--

CREATE TABLE sucursal_actividad_economica_tbl (
    id integer NOT NULL,
    id_sucursal integer NOT NULL,
    id_actividad_economica integer NOT NULL,
    estado character varying(5) NOT NULL,
    fecha_creacion timestamp without time zone DEFAULT now() NOT NULL,
    fecha_ultimo_cambio timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE sucursal_actividad_economica_tbl OWNER TO postgres;

--
-- Name: sucursal_actividad_economica_id_seq; Type: SEQUENCE; Schema: administracion; Owner: postgres
--

CREATE SEQUENCE sucursal_actividad_economica_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE sucursal_actividad_economica_id_seq OWNER TO postgres;

--
-- Name: sucursal_actividad_economica_id_seq; Type: SEQUENCE OWNED BY; Schema: administracion; Owner: postgres
--

ALTER SEQUENCE sucursal_actividad_economica_id_seq OWNED BY sucursal_actividad_economica_tbl.id;


--
-- Name: sucursales_id_seq; Type: SEQUENCE; Schema: administracion; Owner: postgres
--

CREATE SEQUENCE sucursales_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE sucursales_id_seq OWNER TO postgres;

--
-- Name: sucursales; Type: TABLE; Schema: administracion; Owner: postgres
--

CREATE TABLE sucursales (
    id integer DEFAULT nextval('sucursales_id_seq'::regclass) NOT NULL,
    nombre character varying(250) NOT NULL,
    responsable integer NOT NULL,
    datos_empresariales json NOT NULL,
    localizacion_sucursal json NOT NULL,
    datos_adiconales json,
    codigo_sri character varying(3) NOT NULL,
    giro_negocio integer DEFAULT 0 NOT NULL,
    actividad_economica integer DEFAULT 0 NOT NULL,
    id_empresa integer,
    fecha_creacion timestamp without time zone DEFAULT now() NOT NULL,
    fecha_ultima_mod timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE sucursales OWNER TO postgres;

--
-- Name: tipo_accion_vista; Type: TABLE; Schema: administracion; Owner: postgres
--

CREATE TABLE tipo_accion_vista (
    id integer NOT NULL,
    accion_ver boolean NOT NULL,
    accion_guardar boolean NOT NULL,
    accion_modificar boolean NOT NULL,
    estado character varying(5) NOT NULL,
    fecha timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE tipo_accion_vista OWNER TO postgres;

--
-- Name: tipo_accion_vista_id_seq; Type: SEQUENCE; Schema: administracion; Owner: postgres
--

CREATE SEQUENCE tipo_accion_vista_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE tipo_accion_vista_id_seq OWNER TO postgres;

--
-- Name: tipo_accion_vista_id_seq; Type: SEQUENCE OWNED BY; Schema: administracion; Owner: postgres
--

ALTER SEQUENCE tipo_accion_vista_id_seq OWNED BY tipo_accion_vista.id;


--
-- Name: tipo_bienes_servicios; Type: TABLE; Schema: administracion; Owner: postgres
--

CREATE TABLE tipo_bienes_servicios (
    id integer NOT NULL,
    nombre character varying(75) NOT NULL,
    descripcion character varying(500) NOT NULL,
    fecha timestamp without time zone DEFAULT now() NOT NULL,
    estado character varying(5) NOT NULL,
    id_prestacion integer
);


ALTER TABLE tipo_bienes_servicios OWNER TO postgres;

--
-- Name: tipo_bienes_servicios_id_seq; Type: SEQUENCE; Schema: administracion; Owner: postgres
--

CREATE SEQUENCE tipo_bienes_servicios_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE tipo_bienes_servicios_id_seq OWNER TO postgres;

--
-- Name: tipo_bienes_servicios_id_seq; Type: SEQUENCE OWNED BY; Schema: administracion; Owner: postgres
--

ALTER SEQUENCE tipo_bienes_servicios_id_seq OWNED BY tipo_bienes_servicios.id;


--
-- Name: tipo_empresa; Type: TABLE; Schema: administracion; Owner: postgres
--

CREATE TABLE tipo_empresa (
    id integer NOT NULL,
    nombre character(50) NOT NULL,
    descripcion character varying(500) NOT NULL,
    estado character varying(5) NOT NULL,
    fecha timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE tipo_empresa OWNER TO postgres;

--
-- Name: tipo_empresa_id_seq; Type: SEQUENCE; Schema: administracion; Owner: postgres
--

CREATE SEQUENCE tipo_empresa_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE tipo_empresa_id_seq OWNER TO postgres;

--
-- Name: tipo_empresa_id_seq; Type: SEQUENCE OWNED BY; Schema: administracion; Owner: postgres
--

ALTER SEQUENCE tipo_empresa_id_seq OWNED BY tipo_empresa.id;


--
-- Name: tipos_imagenes_empresas; Type: TABLE; Schema: administracion; Owner: postgres
--

CREATE TABLE tipos_imagenes_empresas (
    id integer NOT NULL,
    nombre character varying(250) NOT NULL,
    estado character varying(5) NOT NULL,
    fecha timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE tipos_imagenes_empresas OWNER TO postgres;

--
-- Name: tipos_imagenes_empresas_id_seq; Type: SEQUENCE; Schema: administracion; Owner: postgres
--

CREATE SEQUENCE tipos_imagenes_empresas_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE tipos_imagenes_empresas_id_seq OWNER TO postgres;

--
-- Name: tipos_imagenes_empresas_id_seq; Type: SEQUENCE OWNED BY; Schema: administracion; Owner: postgres
--

ALTER SEQUENCE tipos_imagenes_empresas_id_seq OWNED BY tipos_imagenes_empresas.id;


--
-- Name: usuarios_privilegios; Type: TABLE; Schema: administracion; Owner: postgres
--

CREATE TABLE usuarios_privilegios (
    id integer NOT NULL,
    estado character varying(5) NOT NULL,
    fecha timestamp without time zone DEFAULT now() NOT NULL,
    id_vista integer NOT NULL,
    id_tipo_usuario integer NOT NULL,
    id_tipo_accion_vistas integer NOT NULL
);


ALTER TABLE usuarios_privilegios OWNER TO postgres;

--
-- Name: usuarios_privilegios_id_seq; Type: SEQUENCE; Schema: administracion; Owner: postgres
--

CREATE SEQUENCE usuarios_privilegios_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE usuarios_privilegios_id_seq OWNER TO postgres;

--
-- Name: usuarios_privilegios_id_seq; Type: SEQUENCE OWNED BY; Schema: administracion; Owner: postgres
--

ALTER SEQUENCE usuarios_privilegios_id_seq OWNED BY usuarios_privilegios.id;


--
-- Name: vistas; Type: TABLE; Schema: administracion; Owner: postgres
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
    template_ character varying(500),
    controller_ character varying(500),
    fecha timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE vistas OWNER TO postgres;

--
-- Name: vistas_id_seq; Type: SEQUENCE; Schema: administracion; Owner: postgres
--

CREATE SEQUENCE vistas_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE vistas_id_seq OWNER TO postgres;

--
-- Name: vistas_id_seq; Type: SEQUENCE OWNED BY; Schema: administracion; Owner: postgres
--

ALTER SEQUENCE vistas_id_seq OWNED BY vistas.id;


SET search_path = auditoria, pg_catalog;

--
-- Name: auditoria; Type: TABLE; Schema: auditoria; Owner: postgres
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


ALTER TABLE auditoria OWNER TO postgres;

--
-- Name: COLUMN auditoria.id; Type: COMMENT; Schema: auditoria; Owner: postgres
--

COMMENT ON COLUMN auditoria.id IS 'define el identificador de la tabla auditoria';


--
-- Name: COLUMN auditoria.tabla_afectada; Type: COMMENT; Schema: auditoria; Owner: postgres
--

COMMENT ON COLUMN auditoria.tabla_afectada IS 'almacena el nombre de la tabla que fue afectada';


--
-- Name: COLUMN auditoria.operacion; Type: COMMENT; Schema: auditoria; Owner: postgres
--

COMMENT ON COLUMN auditoria.operacion IS 'guarda la operacion realizada, I insertar / U actualizar/ D borrar  ';


--
-- Name: COLUMN auditoria.variable_anterior; Type: COMMENT; Schema: auditoria; Owner: postgres
--

COMMENT ON COLUMN auditoria.variable_anterior IS 'almacena los valores viejos';


--
-- Name: COLUMN auditoria.variable_nueva; Type: COMMENT; Schema: auditoria; Owner: postgres
--

COMMENT ON COLUMN auditoria.variable_nueva IS 'almacena los valores nuevos';


--
-- Name: COLUMN auditoria.fecha; Type: COMMENT; Schema: auditoria; Owner: postgres
--

COMMENT ON COLUMN auditoria.fecha IS 'almacena la fecha de modificacion de los datos';


--
-- Name: COLUMN auditoria.usuario; Type: COMMENT; Schema: auditoria; Owner: postgres
--

COMMENT ON COLUMN auditoria.usuario IS 'almacena el usuario de la BDD';


--
-- Name: auditoria_id_seq; Type: SEQUENCE; Schema: auditoria; Owner: postgres
--

CREATE SEQUENCE auditoria_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE auditoria_id_seq OWNER TO postgres;

--
-- Name: auditoria_id_seq; Type: SEQUENCE OWNED BY; Schema: auditoria; Owner: postgres
--

ALTER SEQUENCE auditoria_id_seq OWNED BY auditoria.id;


--
-- Name: ingresos_usuarios; Type: TABLE; Schema: auditoria; Owner: postgres
--

CREATE TABLE ingresos_usuarios (
    id integer NOT NULL,
    usuario character varying(100) NOT NULL,
    informacion_servidor json NOT NULL,
    fecha timestamp without time zone DEFAULT now() NOT NULL,
    ip_acceso json NOT NULL
);


ALTER TABLE ingresos_usuarios OWNER TO postgres;

--
-- Name: ingresos_usuarios_id_seq; Type: SEQUENCE; Schema: auditoria; Owner: postgres
--

CREATE SEQUENCE ingresos_usuarios_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE ingresos_usuarios_id_seq OWNER TO postgres;

--
-- Name: ingresos_usuarios_id_seq; Type: SEQUENCE OWNED BY; Schema: auditoria; Owner: postgres
--

ALTER SEQUENCE ingresos_usuarios_id_seq OWNED BY ingresos_usuarios.id;


SET search_path = contabilidad, pg_catalog;

--
-- Name: plazos_credito; Type: TABLE; Schema: contabilidad; Owner: postgres
--

CREATE TABLE plazos_credito (
    id integer NOT NULL,
    nombre character varying(50) NOT NULL,
    dias_credito integer DEFAULT 0 NOT NULL,
    estado character varying(5) NOT NULL,
    fecha time without time zone DEFAULT now() NOT NULL
);


ALTER TABLE plazos_credito OWNER TO postgres;

--
-- Name: Plazos_credito_id_seq; Type: SEQUENCE; Schema: contabilidad; Owner: postgres
--

CREATE SEQUENCE "Plazos_credito_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "Plazos_credito_id_seq" OWNER TO postgres;

--
-- Name: Plazos_credito_id_seq; Type: SEQUENCE OWNED BY; Schema: contabilidad; Owner: postgres
--

ALTER SEQUENCE "Plazos_credito_id_seq" OWNED BY plazos_credito.id;


--
-- Name: ambitos_impuestos; Type: TABLE; Schema: contabilidad; Owner: postgres
--

CREATE TABLE ambitos_impuestos (
    id integer NOT NULL,
    nombre character varying(250) NOT NULL,
    estado character varying(5) NOT NULL,
    fecha date DEFAULT now() NOT NULL
);


ALTER TABLE ambitos_impuestos OWNER TO postgres;

--
-- Name: ambitos_impuestos_id_seq; Type: SEQUENCE; Schema: contabilidad; Owner: postgres
--

CREATE SEQUENCE ambitos_impuestos_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE ambitos_impuestos_id_seq OWNER TO postgres;

--
-- Name: ambitos_impuestos_id_seq; Type: SEQUENCE OWNED BY; Schema: contabilidad; Owner: postgres
--

ALTER SEQUENCE ambitos_impuestos_id_seq OWNED BY ambitos_impuestos.id;


--
-- Name: asientos_contables_diario; Type: TABLE; Schema: contabilidad; Owner: postgres
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


ALTER TABLE asientos_contables_diario OWNER TO postgres;

--
-- Name: asientos_contables_diario_id_seq; Type: SEQUENCE; Schema: contabilidad; Owner: postgres
--

CREATE SEQUENCE asientos_contables_diario_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE asientos_contables_diario_id_seq OWNER TO postgres;

--
-- Name: asientos_contables_diario_id_seq; Type: SEQUENCE OWNED BY; Schema: contabilidad; Owner: postgres
--

ALTER SEQUENCE asientos_contables_diario_id_seq OWNED BY asientos_contables_diario.id;


--
-- Name: bancos; Type: TABLE; Schema: contabilidad; Owner: postgres
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


ALTER TABLE bancos OWNER TO postgres;

--
-- Name: bancos_id_seq; Type: SEQUENCE; Schema: contabilidad; Owner: postgres
--

CREATE SEQUENCE bancos_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE bancos_id_seq OWNER TO postgres;

--
-- Name: bancos_id_seq; Type: SEQUENCE OWNED BY; Schema: contabilidad; Owner: postgres
--

ALTER SEQUENCE bancos_id_seq OWNED BY bancos.id;


--
-- Name: cuentas_contables; Type: TABLE; Schema: contabilidad; Owner: postgres
--

CREATE TABLE cuentas_contables (
    id integer NOT NULL,
    codigo_contable character varying NOT NULL,
    nombre_corto character varying(50) NOT NULL,
    descripcion character varying(500) NOT NULL,
    signo_cuenta character(1) DEFAULT 0 NOT NULL,
    tipo_cuenta integer NOT NULL
);


ALTER TABLE cuentas_contables OWNER TO postgres;

--
-- Name: cuentas_contables_id_seq; Type: SEQUENCE; Schema: contabilidad; Owner: postgres
--

CREATE SEQUENCE cuentas_contables_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE cuentas_contables_id_seq OWNER TO postgres;

--
-- Name: cuentas_contables_id_seq; Type: SEQUENCE OWNED BY; Schema: contabilidad; Owner: postgres
--

ALTER SEQUENCE cuentas_contables_id_seq OWNED BY cuentas_contables.id;


--
-- Name: repositorio_facturas_correo; Type: TABLE; Schema: contabilidad; Owner: postgres
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


ALTER TABLE repositorio_facturas_correo OWNER TO postgres;

--
-- Name: facturas_correo_id_seq; Type: SEQUENCE; Schema: contabilidad; Owner: postgres
--

CREATE SEQUENCE facturas_correo_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE facturas_correo_id_seq OWNER TO postgres;

--
-- Name: facturas_correo_id_seq; Type: SEQUENCE OWNED BY; Schema: contabilidad; Owner: postgres
--

ALTER SEQUENCE facturas_correo_id_seq OWNED BY repositorio_facturas_correo.id;


--
-- Name: fecha_declaracion_ruc; Type: TABLE; Schema: contabilidad; Owner: postgres
--

CREATE TABLE fecha_declaracion_ruc (
    noveno_dig integer NOT NULL,
    fecha_maxima_declaracion character varying(50) NOT NULL,
    numero_dias integer NOT NULL
);


ALTER TABLE fecha_declaracion_ruc OWNER TO postgres;

--
-- Name: finaciaminto; Type: TABLE; Schema: contabilidad; Owner: postgres
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


ALTER TABLE finaciaminto OWNER TO postgres;

--
-- Name: finaciaminto_id_seq; Type: SEQUENCE; Schema: contabilidad; Owner: postgres
--

CREATE SEQUENCE finaciaminto_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE finaciaminto_id_seq OWNER TO postgres;

--
-- Name: finaciaminto_id_seq; Type: SEQUENCE OWNED BY; Schema: contabilidad; Owner: postgres
--

ALTER SEQUENCE finaciaminto_id_seq OWNED BY finaciaminto.id;


--
-- Name: gasto_mes_repositorio; Type: TABLE; Schema: contabilidad; Owner: postgres
--

CREATE TABLE gasto_mes_repositorio (
    id integer NOT NULL,
    id_factura integer NOT NULL,
    id_tipo_gasto integer NOT NULL,
    total_gasto real NOT NULL,
    fecha date DEFAULT now() NOT NULL,
    estado_revicion character varying(5)
);


ALTER TABLE gasto_mes_repositorio OWNER TO postgres;

--
-- Name: gasto_mes_repositorio_id_seq; Type: SEQUENCE; Schema: contabilidad; Owner: postgres
--

CREATE SEQUENCE gasto_mes_repositorio_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE gasto_mes_repositorio_id_seq OWNER TO postgres;

--
-- Name: gasto_mes_repositorio_id_seq; Type: SEQUENCE OWNED BY; Schema: contabilidad; Owner: postgres
--

ALTER SEQUENCE gasto_mes_repositorio_id_seq OWNED BY gasto_mes_repositorio.id;


--
-- Name: gastos_impuestos_renta_deduccion; Type: TABLE; Schema: contabilidad; Owner: postgres
--

CREATE TABLE gastos_impuestos_renta_deduccion (
    id integer NOT NULL,
    id_factura integer NOT NULL,
    id_tipo_gasto_personal integer NOT NULL,
    valor_acumular real NOT NULL,
    estado character varying(5) NOT NULL,
    fecha date DEFAULT now() NOT NULL
);


ALTER TABLE gastos_impuestos_renta_deduccion OWNER TO postgres;

--
-- Name: gastos_impuestos_renta_deduccion_id_seq; Type: SEQUENCE; Schema: contabilidad; Owner: postgres
--

CREATE SEQUENCE gastos_impuestos_renta_deduccion_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE gastos_impuestos_renta_deduccion_id_seq OWNER TO postgres;

--
-- Name: gastos_impuestos_renta_deduccion_id_seq; Type: SEQUENCE OWNED BY; Schema: contabilidad; Owner: postgres
--

ALTER SEQUENCE gastos_impuestos_renta_deduccion_id_seq OWNED BY gastos_impuestos_renta_deduccion.id;


--
-- Name: genealogia_impuestos; Type: TABLE; Schema: contabilidad; Owner: postgres
--

CREATE TABLE genealogia_impuestos (
    id_impuesto_padre integer NOT NULL,
    id_impuesto_hijo integer NOT NULL
);


ALTER TABLE genealogia_impuestos OWNER TO postgres;

--
-- Name: TABLE genealogia_impuestos; Type: COMMENT; Schema: contabilidad; Owner: postgres
--

COMMENT ON TABLE genealogia_impuestos IS 'define el arbol de los impuestos para el grupo';


--
-- Name: grupo_impuestos; Type: TABLE; Schema: contabilidad; Owner: postgres
--

CREATE TABLE grupo_impuestos (
    id integer NOT NULL,
    nombre character varying(250) NOT NULL,
    estado character varying(5) NOT NULL,
    fecha timestamp with time zone NOT NULL
);


ALTER TABLE grupo_impuestos OWNER TO postgres;

--
-- Name: grupo_impuestos_id_seq; Type: SEQUENCE; Schema: contabilidad; Owner: postgres
--

CREATE SEQUENCE grupo_impuestos_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE grupo_impuestos_id_seq OWNER TO postgres;

--
-- Name: grupo_impuestos_id_seq; Type: SEQUENCE OWNED BY; Schema: contabilidad; Owner: postgres
--

ALTER SEQUENCE grupo_impuestos_id_seq OWNED BY grupo_impuestos.id;


--
-- Name: impuestos; Type: TABLE; Schema: contabilidad; Owner: postgres
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


ALTER TABLE impuestos OWNER TO postgres;

--
-- Name: impuestos_id_seq; Type: SEQUENCE; Schema: contabilidad; Owner: postgres
--

CREATE SEQUENCE impuestos_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE impuestos_id_seq OWNER TO postgres;

--
-- Name: impuestos_id_seq; Type: SEQUENCE OWNED BY; Schema: contabilidad; Owner: postgres
--

ALTER SEQUENCE impuestos_id_seq OWNED BY impuestos.id;


--
-- Name: repositorio_facturas; Type: TABLE; Schema: contabilidad; Owner: postgres
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


ALTER TABLE repositorio_facturas OWNER TO postgres;

--
-- Name: repositorio_facturas_id_factura_seq; Type: SEQUENCE; Schema: contabilidad; Owner: postgres
--

CREATE SEQUENCE repositorio_facturas_id_factura_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE repositorio_facturas_id_factura_seq OWNER TO postgres;

--
-- Name: repositorio_facturas_id_factura_seq; Type: SEQUENCE OWNED BY; Schema: contabilidad; Owner: postgres
--

ALTER SEQUENCE repositorio_facturas_id_factura_seq OWNED BY repositorio_facturas.id_factura;


--
-- Name: repositorio_facturas_rechazadas; Type: TABLE; Schema: contabilidad; Owner: postgres
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


ALTER TABLE repositorio_facturas_rechazadas OWNER TO postgres;

--
-- Name: repositorio_facturas_rechazadas_id_factura_r_seq; Type: SEQUENCE; Schema: contabilidad; Owner: postgres
--

CREATE SEQUENCE repositorio_facturas_rechazadas_id_factura_r_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE repositorio_facturas_rechazadas_id_factura_r_seq OWNER TO postgres;

--
-- Name: repositorio_facturas_rechazadas_id_factura_r_seq; Type: SEQUENCE OWNED BY; Schema: contabilidad; Owner: postgres
--

ALTER SEQUENCE repositorio_facturas_rechazadas_id_factura_r_seq OWNED BY repositorio_facturas_rechazadas.id_factura_r;


--
-- Name: rol_pagos_empleados; Type: TABLE; Schema: contabilidad; Owner: postgres
--

CREATE TABLE rol_pagos_empleados (
    id integer NOT NULL,
    id_empleado integer NOT NULL,
    mes_pago character varying(50) DEFAULT date_part('month'::text, now()) NOT NULL
);


ALTER TABLE rol_pagos_empleados OWNER TO postgres;

--
-- Name: rol_pagos_empleados_id_seq; Type: SEQUENCE; Schema: contabilidad; Owner: postgres
--

CREATE SEQUENCE rol_pagos_empleados_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE rol_pagos_empleados_id_seq OWNER TO postgres;

--
-- Name: rol_pagos_empleados_id_seq; Type: SEQUENCE OWNED BY; Schema: contabilidad; Owner: postgres
--

ALTER SEQUENCE rol_pagos_empleados_id_seq OWNED BY rol_pagos_empleados.id;


--
-- Name: tipos_cuentas_contables; Type: TABLE; Schema: contabilidad; Owner: postgres
--

CREATE TABLE tipos_cuentas_contables (
    id integer NOT NULL,
    nombre character varying(250) NOT NULL,
    descripcion character varying(500) NOT NULL,
    estado character varying(5) NOT NULL,
    fecha timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE tipos_cuentas_contables OWNER TO postgres;

--
-- Name: tipo_cuenta_contable_id_seq; Type: SEQUENCE; Schema: contabilidad; Owner: postgres
--

CREATE SEQUENCE tipo_cuenta_contable_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE tipo_cuenta_contable_id_seq OWNER TO postgres;

--
-- Name: tipo_cuenta_contable_id_seq; Type: SEQUENCE OWNED BY; Schema: contabilidad; Owner: postgres
--

ALTER SEQUENCE tipo_cuenta_contable_id_seq OWNED BY tipos_cuentas_contables.id;


--
-- Name: tipo_documentos; Type: TABLE; Schema: contabilidad; Owner: postgres
--

CREATE TABLE tipo_documentos (
    id character varying(5) NOT NULL,
    nombre character varying(50) NOT NULL,
    descripcion character varying(250) NOT NULL,
    estado character varying(5) NOT NULL,
    fecha timestamp(0) without time zone DEFAULT now()
);


ALTER TABLE tipo_documentos OWNER TO postgres;

--
-- Name: tipo_impuestos; Type: TABLE; Schema: contabilidad; Owner: postgres
--

CREATE TABLE tipo_impuestos (
    id integer NOT NULL,
    nombre character varying(50) NOT NULL,
    descripcion character varying(250) NOT NULL,
    estado character varying(5) NOT NULL,
    fecha timestamp(0) without time zone DEFAULT now()
);


ALTER TABLE tipo_impuestos OWNER TO postgres;

--
-- Name: tipo_impuestos_id_seq; Type: SEQUENCE; Schema: contabilidad; Owner: postgres
--

CREATE SEQUENCE tipo_impuestos_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE tipo_impuestos_id_seq OWNER TO postgres;

--
-- Name: tipo_impuestos_id_seq; Type: SEQUENCE OWNED BY; Schema: contabilidad; Owner: postgres
--

ALTER SEQUENCE tipo_impuestos_id_seq OWNED BY tipo_impuestos.id;


--
-- Name: tipos_gastos_personales; Type: TABLE; Schema: contabilidad; Owner: postgres
--

CREATE TABLE tipos_gastos_personales (
    id integer NOT NULL,
    nombre character varying(50) NOT NULL,
    descripcion character varying(500) NOT NULL,
    valor_maximo real NOT NULL,
    estado character varying(5),
    fecha date DEFAULT now() NOT NULL
);


ALTER TABLE tipos_gastos_personales OWNER TO postgres;

--
-- Name: tipos_gastos_personales_id_seq; Type: SEQUENCE; Schema: contabilidad; Owner: postgres
--

CREATE SEQUENCE tipos_gastos_personales_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE tipos_gastos_personales_id_seq OWNER TO postgres;

--
-- Name: tipos_gastos_personales_id_seq; Type: SEQUENCE OWNED BY; Schema: contabilidad; Owner: postgres
--

ALTER SEQUENCE tipos_gastos_personales_id_seq OWNED BY tipos_gastos_personales.id;


SET search_path = inventario, pg_catalog;

--
-- Name: bodegas; Type: TABLE; Schema: inventario; Owner: postgres
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


ALTER TABLE bodegas OWNER TO postgres;

--
-- Name: bodegas_id_seq; Type: SEQUENCE; Schema: inventario; Owner: postgres
--

CREATE SEQUENCE bodegas_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE bodegas_id_seq OWNER TO postgres;

--
-- Name: bodegas_id_seq; Type: SEQUENCE OWNED BY; Schema: inventario; Owner: postgres
--

ALTER SEQUENCE bodegas_id_seq OWNED BY bodegas.id;


--
-- Name: catalogos; Type: TABLE; Schema: inventario; Owner: postgres
--

CREATE TABLE catalogos (
    id integer NOT NULL,
    tipo_catalogo integer NOT NULL,
    producto integer NOT NULL
);


ALTER TABLE catalogos OWNER TO postgres;

--
-- Name: catalogos_id_seq; Type: SEQUENCE; Schema: inventario; Owner: postgres
--

CREATE SEQUENCE catalogos_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE catalogos_id_seq OWNER TO postgres;

--
-- Name: catalogos_id_seq; Type: SEQUENCE OWNED BY; Schema: inventario; Owner: postgres
--

ALTER SEQUENCE catalogos_id_seq OWNED BY catalogos.id;


--
-- Name: categorias; Type: TABLE; Schema: inventario; Owner: postgres
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


ALTER TABLE categorias OWNER TO postgres;

--
-- Name: categorias_id_seq; Type: SEQUENCE; Schema: inventario; Owner: postgres
--

CREATE SEQUENCE categorias_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE categorias_id_seq OWNER TO postgres;

--
-- Name: categorias_id_seq; Type: SEQUENCE OWNED BY; Schema: inventario; Owner: postgres
--

ALTER SEQUENCE categorias_id_seq OWNED BY categorias.id;


--
-- Name: descripcion_producto; Type: TABLE; Schema: inventario; Owner: postgres
--

CREATE TABLE descripcion_producto (
    id integer NOT NULL,
    producto integer NOT NULL,
    descripcion_corta character varying(2000) NOT NULL,
    descripcion_proveedor character varying(4000) NOT NULL,
    descripcion_proformas character varying(4000) NOT NULL,
    descripcion_movi_inventa character varying(4000) NOT NULL
);


ALTER TABLE descripcion_producto OWNER TO postgres;

--
-- Name: COLUMN descripcion_producto.descripcion_corta; Type: COMMENT; Schema: inventario; Owner: postgres
--

COMMENT ON COLUMN descripcion_producto.descripcion_corta IS 'descripcion en caso de ubicar en la factura';


--
-- Name: COLUMN descripcion_producto.descripcion_proveedor; Type: COMMENT; Schema: inventario; Owner: postgres
--

COMMENT ON COLUMN descripcion_producto.descripcion_proveedor IS 'descripcion para poner en solicitud del proveedor';


--
-- Name: descripcion_producto_id_seq; Type: SEQUENCE; Schema: inventario; Owner: postgres
--

CREATE SEQUENCE descripcion_producto_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE descripcion_producto_id_seq OWNER TO postgres;

--
-- Name: descripcion_producto_id_seq; Type: SEQUENCE OWNED BY; Schema: inventario; Owner: postgres
--

ALTER SEQUENCE descripcion_producto_id_seq OWNED BY descripcion_producto.id;


--
-- Name: estado_descriptivo; Type: TABLE; Schema: inventario; Owner: postgres
--

CREATE TABLE estado_descriptivo (
    id integer NOT NULL,
    nombre character varying(250) NOT NULL,
    descripcion character varying(2000) NOT NULL,
    estado character varying(5) NOT NULL,
    fecha timestamp with time zone DEFAULT now() NOT NULL,
    id_padre integer
);


ALTER TABLE estado_descriptivo OWNER TO postgres;

--
-- Name: estado_descriptivo_id_seq; Type: SEQUENCE; Schema: inventario; Owner: postgres
--

CREATE SEQUENCE estado_descriptivo_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE estado_descriptivo_id_seq OWNER TO postgres;

--
-- Name: estado_descriptivo_id_seq; Type: SEQUENCE OWNED BY; Schema: inventario; Owner: postgres
--

ALTER SEQUENCE estado_descriptivo_id_seq OWNED BY estado_descriptivo.id;


--
-- Name: garantias; Type: TABLE; Schema: inventario; Owner: postgres
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


ALTER TABLE garantias OWNER TO postgres;

--
-- Name: COLUMN garantias.duracion; Type: COMMENT; Schema: inventario; Owner: postgres
--

COMMENT ON COLUMN garantias.duracion IS 'duracion en meses de la garantia';


--
-- Name: garantias_id_seq; Type: SEQUENCE; Schema: inventario; Owner: postgres
--

CREATE SEQUENCE garantias_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE garantias_id_seq OWNER TO postgres;

--
-- Name: garantias_id_seq; Type: SEQUENCE OWNED BY; Schema: inventario; Owner: postgres
--

ALTER SEQUENCE garantias_id_seq OWNED BY garantias.id;


--
-- Name: imagenes_productos; Type: TABLE; Schema: inventario; Owner: postgres
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


ALTER TABLE imagenes_productos OWNER TO postgres;

--
-- Name: COLUMN imagenes_productos.id; Type: COMMENT; Schema: inventario; Owner: postgres
--

COMMENT ON COLUMN imagenes_productos.id IS 'identificador';


--
-- Name: COLUMN imagenes_productos.nombre; Type: COMMENT; Schema: inventario; Owner: postgres
--

COMMENT ON COLUMN imagenes_productos.nombre IS 'nombre de la imagen';


--
-- Name: COLUMN imagenes_productos.direccion; Type: COMMENT; Schema: inventario; Owner: postgres
--

COMMENT ON COLUMN imagenes_productos.direccion IS 'direccion donde se encuentra la imagen';


--
-- Name: COLUMN imagenes_productos.tipo_imagen; Type: COMMENT; Schema: inventario; Owner: postgres
--

COMMENT ON COLUMN imagenes_productos.tipo_imagen IS 'codigo del tipo de imagen';


--
-- Name: manejo_presios; Type: TABLE; Schema: inventario; Owner: postgres
--

CREATE TABLE manejo_presios (
    id integer NOT NULL,
    id_producto integer NOT NULL,
    nombre character varying NOT NULL,
    valor_precio real NOT NULL,
    estado character varying NOT NULL,
    fecha timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE manejo_presios OWNER TO postgres;

--
-- Name: manejo_presios_id_seq; Type: SEQUENCE; Schema: inventario; Owner: postgres
--

CREATE SEQUENCE manejo_presios_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE manejo_presios_id_seq OWNER TO postgres;

--
-- Name: manejo_presios_id_seq; Type: SEQUENCE OWNED BY; Schema: inventario; Owner: postgres
--

ALTER SEQUENCE manejo_presios_id_seq OWNED BY manejo_presios.id;


--
-- Name: marcas; Type: TABLE; Schema: inventario; Owner: postgres
--

CREATE TABLE marcas (
    id integer NOT NULL,
    nombre character varying(50) NOT NULL,
    descripcion character varying(2000) NOT NULL,
    estado character varying(5) NOT NULL,
    fecha timestamp with time zone DEFAULT now() NOT NULL,
    id_padre integer NOT NULL
);


ALTER TABLE marcas OWNER TO postgres;

--
-- Name: marcas_id_seq; Type: SEQUENCE; Schema: inventario; Owner: postgres
--

CREATE SEQUENCE marcas_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE marcas_id_seq OWNER TO postgres;

--
-- Name: marcas_id_seq; Type: SEQUENCE OWNED BY; Schema: inventario; Owner: postgres
--

ALTER SEQUENCE marcas_id_seq OWNED BY marcas.id;


--
-- Name: modelos; Type: TABLE; Schema: inventario; Owner: postgres
--

CREATE TABLE modelos (
    id integer NOT NULL,
    nombre character varying(250) NOT NULL,
    descripcion character varying(2000) NOT NULL,
    estado character varying(5) NOT NULL,
    fecha timestamp with time zone DEFAULT now() NOT NULL,
    id_padre integer NOT NULL
);


ALTER TABLE modelos OWNER TO postgres;

--
-- Name: modelos_id_seq; Type: SEQUENCE; Schema: inventario; Owner: postgres
--

CREATE SEQUENCE modelos_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE modelos_id_seq OWNER TO postgres;

--
-- Name: modelos_id_seq; Type: SEQUENCE OWNED BY; Schema: inventario; Owner: postgres
--

ALTER SEQUENCE modelos_id_seq OWNED BY modelos.id;


--
-- Name: productos; Type: TABLE; Schema: inventario; Owner: postgres
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


ALTER TABLE productos OWNER TO postgres;

--
-- Name: productos_id_seq; Type: SEQUENCE; Schema: inventario; Owner: postgres
--

CREATE SEQUENCE productos_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE productos_id_seq OWNER TO postgres;

--
-- Name: productos_id_seq; Type: SEQUENCE OWNED BY; Schema: inventario; Owner: postgres
--

ALTER SEQUENCE productos_id_seq OWNED BY productos.id;


--
-- Name: productos_impuestos; Type: TABLE; Schema: inventario; Owner: postgres
--

CREATE TABLE productos_impuestos (
    id integer NOT NULL,
    producto integer NOT NULL,
    impuesto integer NOT NULL
);


ALTER TABLE productos_impuestos OWNER TO postgres;

--
-- Name: productos_impuestos_id_seq; Type: SEQUENCE; Schema: inventario; Owner: postgres
--

CREATE SEQUENCE productos_impuestos_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE productos_impuestos_id_seq OWNER TO postgres;

--
-- Name: productos_impuestos_id_seq; Type: SEQUENCE OWNED BY; Schema: inventario; Owner: postgres
--

ALTER SEQUENCE productos_impuestos_id_seq OWNED BY productos_impuestos.id;


--
-- Name: proveedores; Type: TABLE; Schema: inventario; Owner: postgres
--

CREATE TABLE proveedores (
    id integer NOT NULL,
    nombre character varying(250) NOT NULL,
    ruc character varying(15) NOT NULL,
    direccion character varying(250) NOT NULL,
    id_empresa integer NOT NULL
);


ALTER TABLE proveedores OWNER TO postgres;

--
-- Name: COLUMN proveedores.id_empresa; Type: COMMENT; Schema: inventario; Owner: postgres
--

COMMENT ON COLUMN proveedores.id_empresa IS 'conenta el probedor con los datos de su empresa';


--
-- Name: proveedores_id_seq; Type: SEQUENCE; Schema: inventario; Owner: postgres
--

CREATE SEQUENCE proveedores_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE proveedores_id_seq OWNER TO postgres;

--
-- Name: proveedores_id_seq; Type: SEQUENCE OWNED BY; Schema: inventario; Owner: postgres
--

ALTER SEQUENCE proveedores_id_seq OWNED BY proveedores.id;


--
-- Name: tipo_consumo; Type: TABLE; Schema: inventario; Owner: postgres
--

CREATE TABLE tipo_consumo (
    id integer NOT NULL,
    nombre character varying(50) NOT NULL,
    descripcion character varying(2000) NOT NULL,
    estado character varying(5) NOT NULL,
    fecha timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE tipo_consumo OWNER TO postgres;

--
-- Name: tipo_consumo_id_seq; Type: SEQUENCE; Schema: inventario; Owner: postgres
--

CREATE SEQUENCE tipo_consumo_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE tipo_consumo_id_seq OWNER TO postgres;

--
-- Name: tipo_consumo_id_seq; Type: SEQUENCE OWNED BY; Schema: inventario; Owner: postgres
--

ALTER SEQUENCE tipo_consumo_id_seq OWNED BY tipo_consumo.id;


--
-- Name: tipos_catalogos; Type: TABLE; Schema: inventario; Owner: postgres
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


ALTER TABLE tipos_catalogos OWNER TO postgres;

--
-- Name: tipos_catalogos_id_seq; Type: SEQUENCE; Schema: inventario; Owner: postgres
--

CREATE SEQUENCE tipos_catalogos_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE tipos_catalogos_id_seq OWNER TO postgres;

--
-- Name: tipos_catalogos_id_seq; Type: SEQUENCE OWNED BY; Schema: inventario; Owner: postgres
--

ALTER SEQUENCE tipos_catalogos_id_seq OWNED BY tipos_catalogos.id;


--
-- Name: tipos_categorias; Type: TABLE; Schema: inventario; Owner: postgres
--

CREATE TABLE tipos_categorias (
    id integer NOT NULL,
    nombre character varying(50) NOT NULL,
    descripcion character varying(2000) NOT NULL,
    estado character varying(5) NOT NULL,
    fecha timestamp with time zone DEFAULT now()
);


ALTER TABLE tipos_categorias OWNER TO postgres;

--
-- Name: tipos_categorias_id_seq; Type: SEQUENCE; Schema: inventario; Owner: postgres
--

CREATE SEQUENCE tipos_categorias_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE tipos_categorias_id_seq OWNER TO postgres;

--
-- Name: tipos_categorias_id_seq; Type: SEQUENCE OWNED BY; Schema: inventario; Owner: postgres
--

ALTER SEQUENCE tipos_categorias_id_seq OWNED BY tipos_categorias.id;


--
-- Name: tipos_garantias; Type: TABLE; Schema: inventario; Owner: postgres
--

CREATE TABLE tipos_garantias (
    id integer NOT NULL,
    nombre character varying(250) NOT NULL,
    descripcion character varying(2000),
    fecha timestamp with time zone DEFAULT now() NOT NULL,
    estado character varying(5)
);


ALTER TABLE tipos_garantias OWNER TO postgres;

--
-- Name: COLUMN tipos_garantias.id; Type: COMMENT; Schema: inventario; Owner: postgres
--

COMMENT ON COLUMN tipos_garantias.id IS 'identificador';


--
-- Name: COLUMN tipos_garantias.fecha; Type: COMMENT; Schema: inventario; Owner: postgres
--

COMMENT ON COLUMN tipos_garantias.fecha IS 'fechade creacion del tipo de garantia';


--
-- Name: COLUMN tipos_garantias.estado; Type: COMMENT; Schema: inventario; Owner: postgres
--

COMMENT ON COLUMN tipos_garantias.estado IS 'define el estado del tipo de garantia';


--
-- Name: tipos_garantias_id_seq; Type: SEQUENCE; Schema: inventario; Owner: postgres
--

CREATE SEQUENCE tipos_garantias_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE tipos_garantias_id_seq OWNER TO postgres;

--
-- Name: tipos_garantias_id_seq; Type: SEQUENCE OWNED BY; Schema: inventario; Owner: postgres
--

ALTER SEQUENCE tipos_garantias_id_seq OWNED BY tipos_garantias.id;


--
-- Name: tipos_imagenes_productos; Type: TABLE; Schema: inventario; Owner: postgres
--

CREATE TABLE tipos_imagenes_productos (
    id integer NOT NULL,
    nombre character varying(250) NOT NULL,
    estado character varying(5) NOT NULL,
    fecha timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE tipos_imagenes_productos OWNER TO postgres;

--
-- Name: TABLE tipos_imagenes_productos; Type: COMMENT; Schema: inventario; Owner: postgres
--

COMMENT ON TABLE tipos_imagenes_productos IS 'contiene las direccioenes de las imagenes ';


--
-- Name: COLUMN tipos_imagenes_productos.id; Type: COMMENT; Schema: inventario; Owner: postgres
--

COMMENT ON COLUMN tipos_imagenes_productos.id IS 'identificador de clave primaria';


--
-- Name: COLUMN tipos_imagenes_productos.nombre; Type: COMMENT; Schema: inventario; Owner: postgres
--

COMMENT ON COLUMN tipos_imagenes_productos.nombre IS 'nombre del tipo de imagen';


--
-- Name: COLUMN tipos_imagenes_productos.estado; Type: COMMENT; Schema: inventario; Owner: postgres
--

COMMENT ON COLUMN tipos_imagenes_productos.estado IS 'define si esta activo o no le tipo de imagen';


--
-- Name: tipos_imagenes_productos_id_seq; Type: SEQUENCE; Schema: inventario; Owner: postgres
--

CREATE SEQUENCE tipos_imagenes_productos_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE tipos_imagenes_productos_id_seq OWNER TO postgres;

--
-- Name: tipos_imagenes_productos_id_seq; Type: SEQUENCE OWNED BY; Schema: inventario; Owner: postgres
--

ALTER SEQUENCE tipos_imagenes_productos_id_seq OWNED BY tipos_imagenes_productos.id;


--
-- Name: tipos_productos; Type: TABLE; Schema: inventario; Owner: postgres
--

CREATE TABLE tipos_productos (
    id integer NOT NULL,
    nombre character varying(250) NOT NULL,
    descripcion character varying(2000) NOT NULL,
    estado character varying(5) NOT NULL,
    fecha timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE tipos_productos OWNER TO postgres;

--
-- Name: tipos_productos_id_seq; Type: SEQUENCE; Schema: inventario; Owner: postgres
--

CREATE SEQUENCE tipos_productos_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE tipos_productos_id_seq OWNER TO postgres;

--
-- Name: tipos_productos_id_seq; Type: SEQUENCE OWNED BY; Schema: inventario; Owner: postgres
--

ALTER SEQUENCE tipos_productos_id_seq OWNED BY tipos_productos.id;


--
-- Name: tipos_tipo_consumo; Type: TABLE; Schema: inventario; Owner: postgres
--

CREATE TABLE tipos_tipo_consumo (
    id integer NOT NULL,
    nombre character varying(50) NOT NULL,
    descripcion character varying(2000) NOT NULL,
    estado character varying(5) NOT NULL,
    fecha time with time zone DEFAULT now() NOT NULL
);


ALTER TABLE tipos_tipo_consumo OWNER TO postgres;

--
-- Name: tipos_tipo_consumo_id_seq; Type: SEQUENCE; Schema: inventario; Owner: postgres
--

CREATE SEQUENCE tipos_tipo_consumo_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE tipos_tipo_consumo_id_seq OWNER TO postgres;

--
-- Name: tipos_tipo_consumo_id_seq; Type: SEQUENCE OWNED BY; Schema: inventario; Owner: postgres
--

ALTER SEQUENCE tipos_tipo_consumo_id_seq OWNED BY tipos_tipo_consumo.id;


--
-- Name: ubicaciones; Type: TABLE; Schema: inventario; Owner: postgres
--

CREATE TABLE ubicaciones (
    id integer NOT NULL,
    nombre character varying(250) NOT NULL,
    descripcion character varying(2000) NOT NULL,
    id_padre integer DEFAULT 0 NOT NULL,
    estado character varying(5) NOT NULL,
    fecha timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE ubicaciones OWNER TO postgres;

--
-- Name: ubicaciones_id_seq; Type: SEQUENCE; Schema: inventario; Owner: postgres
--

CREATE SEQUENCE ubicaciones_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE ubicaciones_id_seq OWNER TO postgres;

--
-- Name: ubicaciones_id_seq; Type: SEQUENCE OWNED BY; Schema: inventario; Owner: postgres
--

ALTER SEQUENCE ubicaciones_id_seq OWNED BY ubicaciones.id;


SET search_path = public, pg_catalog;

--
-- Name: estados; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE estados (
    id character varying(5) NOT NULL,
    nombre character varying(50) NOT NULL,
    descripcion character varying(250) NOT NULL,
    fecha date DEFAULT now() NOT NULL
);


ALTER TABLE estados OWNER TO postgres;

--
-- Name: COLUMN estados.id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN estados.id IS 'define el identificados';


--
-- Name: COLUMN estados.nombre; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN estados.nombre IS 'define nombre corto del estado';


--
-- Name: operadoras_telefonicas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE operadoras_telefonicas (
    id integer NOT NULL,
    nombre character varying(50) NOT NULL,
    descripcion character varying(500) NOT NULL,
    estado character varying(5) NOT NULL,
    fecha time with time zone DEFAULT now() NOT NULL
);


ALTER TABLE operadoras_telefonicas OWNER TO postgres;

--
-- Name: operadoras_telefonicas_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE operadoras_telefonicas_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE operadoras_telefonicas_id_seq OWNER TO postgres;

--
-- Name: operadoras_telefonicas_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE operadoras_telefonicas_id_seq OWNED BY operadoras_telefonicas.id;


--
-- Name: personas; Type: TABLE; Schema: public; Owner: postgres
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


ALTER TABLE personas OWNER TO postgres;

--
-- Name: personas_correo_electronico; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE personas_correo_electronico (
    id integer NOT NULL,
    id_persona integer NOT NULL,
    correo_electronico character varying(250) NOT NULL,
    estado character varying(5) NOT NULL,
    fecha timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE personas_correo_electronico OWNER TO postgres;

--
-- Name: personas_correo_electronico_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE personas_correo_electronico_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE personas_correo_electronico_id_seq OWNER TO postgres;

--
-- Name: personas_correo_electronico_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE personas_correo_electronico_id_seq OWNED BY personas_correo_electronico.id;


--
-- Name: personas_documentos_identificacion; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE personas_documentos_identificacion (
    id integer NOT NULL,
    id_persona integer NOT NULL,
    id_tipo_documento integer NOT NULL,
    numero_identificacion character varying(50) NOT NULL,
    estado character varying(5) NOT NULL,
    fecha time with time zone DEFAULT now() NOT NULL
);


ALTER TABLE personas_documentos_identificacion OWNER TO postgres;

--
-- Name: personas_documentos_identificacion_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE personas_documentos_identificacion_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE personas_documentos_identificacion_id_seq OWNER TO postgres;

--
-- Name: personas_documentos_identificacion_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE personas_documentos_identificacion_id_seq OWNED BY personas_documentos_identificacion.id;


--
-- Name: personas_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE personas_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE personas_id_seq OWNER TO postgres;

--
-- Name: personas_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE personas_id_seq OWNED BY personas.id;


--
-- Name: telefonos_personas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE telefonos_personas (
    id integer NOT NULL,
    id_persona integer NOT NULL,
    numero character varying(25) NOT NULL,
    fecha timestamp with time zone DEFAULT now() NOT NULL,
    estado character varying(5) NOT NULL,
    id_operadora_telefonica integer NOT NULL
);


ALTER TABLE telefonos_personas OWNER TO postgres;

--
-- Name: telefonos_personas_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE telefonos_personas_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE telefonos_personas_id_seq OWNER TO postgres;

--
-- Name: telefonos_personas_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE telefonos_personas_id_seq OWNED BY telefonos_personas.id;


--
-- Name: tipo_documento_identificacion; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE tipo_documento_identificacion (
    id integer NOT NULL,
    nombre character varying(75) NOT NULL,
    descripcion character varying(2000) NOT NULL,
    estado character varying(5) NOT NULL,
    fecha time with time zone DEFAULT now() NOT NULL
);


ALTER TABLE tipo_documento_identificacion OWNER TO postgres;

--
-- Name: tipo_documento_identificaion_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE tipo_documento_identificaion_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE tipo_documento_identificaion_id_seq OWNER TO postgres;

--
-- Name: tipo_documento_identificaion_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE tipo_documento_identificaion_id_seq OWNED BY tipo_documento_identificacion.id;


--
-- Name: view_categorias; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW view_categorias AS
 WITH RECURSIVE path(nombre, descripcion, path, parent, id, tipo_categoria, id_padre, estado, fecha) AS (
         SELECT categorias.nombre,
            categorias.descripcion,
            '/'::text AS text,
            NULL::text AS text,
            categorias.id,
            categorias.tipo_categoria,
            categorias.id_padre,
            categorias.estado,
            categorias.fecha
           FROM inventario.categorias
          WHERE ((categorias.id_padre)::text = '0'::text)
        UNION
         SELECT categorias.nombre,
            categorias.descripcion,
            ((parentpath.path ||
                CASE parentpath.path
                    WHEN '/'::text THEN ''::text
                    ELSE '/'::text
                END) || (categorias.nombre)::text),
            parentpath.path,
            categorias.id,
            categorias.tipo_categoria,
            categorias.id_padre,
            categorias.estado,
            categorias.fecha
           FROM inventario.categorias,
            path parentpath
          WHERE ((categorias.id_padre)::text = (parentpath.id)::text)
        )
 SELECT path.nombre,
    path.descripcion,
    path.path,
    path.parent,
    path.id,
    path.tipo_categoria,
    path.id_padre,
    path.estado,
    path.fecha
   FROM path;


ALTER TABLE view_categorias OWNER TO postgres;

--
-- Name: VIEW view_categorias; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON VIEW view_categorias IS 'crea la vista categorias, definida como arbol';


SET search_path = ventas, pg_catalog;

--
-- Name: formas_pago; Type: TABLE; Schema: ventas; Owner: postgres
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


ALTER TABLE formas_pago OWNER TO postgres;

SET search_path = public, pg_catalog;

--
-- Name: view_formas_pago; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW view_formas_pago AS
 WITH RECURSIVE path(nombre, descripcion, path, parent, id, codigo_sri, id_padre, estado, fecha) AS (
         SELECT formas_pago.nombre,
            formas_pago.descripcion,
            '/'::text AS text,
            NULL::text AS text,
            formas_pago.id,
            formas_pago.codigo_sri,
            formas_pago.id_padre,
            formas_pago.estado,
            formas_pago.fecha
           FROM ventas.formas_pago
          WHERE ((formas_pago.id_padre)::text = '0'::text)
        UNION
         SELECT formas_pago.nombre,
            formas_pago.descripcion,
            ((parentpath.path ||
                CASE parentpath.path
                    WHEN '/'::text THEN ''::text
                    ELSE '/'::text
                END) || (formas_pago.nombre)::text),
            parentpath.path,
            formas_pago.id,
            formas_pago.codigo_sri,
            formas_pago.id_padre,
            formas_pago.estado,
            formas_pago.fecha
           FROM ventas.formas_pago,
            path parentpath
          WHERE ((formas_pago.id_padre)::text = (parentpath.id)::text)
        )
 SELECT path.nombre,
    path.descripcion,
    path.path,
    path.parent,
    path.id,
    path.codigo_sri,
    path.id_padre,
    path.estado,
    path.fecha
   FROM path;


ALTER TABLE view_formas_pago OWNER TO postgres;

--
-- Name: VIEW view_formas_pago; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON VIEW view_formas_pago IS 'crea la vista formas de pago, definida como arbol';


--
-- Name: view_ubicaciones; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW view_ubicaciones AS
 WITH RECURSIVE path(nombre, descripcion, path, parent, id, id_padre, estado, fecha) AS (
         SELECT ubicaciones.nombre,
            ubicaciones.descripcion,
            '/'::text AS text,
            NULL::text AS text,
            ubicaciones.id,
            ubicaciones.id_padre,
            ubicaciones.estado,
            ubicaciones.fecha
           FROM inventario.ubicaciones
          WHERE ((ubicaciones.id_padre)::text = '0'::text)
        UNION
         SELECT ubicaciones.nombre,
            ubicaciones.descripcion,
            ((parentpath.path ||
                CASE parentpath.path
                    WHEN '/'::text THEN ''::text
                    ELSE '/'::text
                END) || (ubicaciones.nombre)::text),
            parentpath.path,
            ubicaciones.id,
            ubicaciones.id_padre,
            ubicaciones.estado,
            ubicaciones.fecha
           FROM inventario.ubicaciones,
            path parentpath
          WHERE ((ubicaciones.id_padre)::text = (parentpath.id)::text)
        )
 SELECT path.nombre,
    path.descripcion,
    path.path,
    path.parent,
    path.id,
    path.id_padre,
    path.estado,
    path.fecha
   FROM path;


ALTER TABLE view_ubicaciones OWNER TO postgres;

--
-- Name: VIEW view_ubicaciones; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON VIEW view_ubicaciones IS 'crea la vista ubicaciones, definida como arbol';


SET search_path = talento_humano, pg_catalog;

--
-- Name: cargos; Type: TABLE; Schema: talento_humano; Owner: postgres
--

CREATE TABLE cargos (
    id integer NOT NULL,
    nombre character varying(150) NOT NULL,
    estado character varying(5) NOT NULL,
    fecha timestamp without time zone DEFAULT now() NOT NULL,
    id_padre integer
);


ALTER TABLE cargos OWNER TO postgres;

--
-- Name: cargos_id_seq; Type: SEQUENCE; Schema: talento_humano; Owner: postgres
--

CREATE SEQUENCE cargos_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE cargos_id_seq OWNER TO postgres;

--
-- Name: cargos_id_seq; Type: SEQUENCE OWNED BY; Schema: talento_humano; Owner: postgres
--

ALTER SEQUENCE cargos_id_seq OWNED BY cargos.id;


--
-- Name: empleados; Type: TABLE; Schema: talento_humano; Owner: postgres
--

CREATE TABLE empleados (
    id integer NOT NULL,
    id_persona integer NOT NULL,
    estado character varying(5) NOT NULL,
    fecha timestamp with time zone DEFAULT now() NOT NULL,
    id_usuario character varying(75),
    id_cargo integer
);


ALTER TABLE empleados OWNER TO postgres;

--
-- Name: empleados_id_seq; Type: SEQUENCE; Schema: talento_humano; Owner: postgres
--

CREATE SEQUENCE empleados_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE empleados_id_seq OWNER TO postgres;

--
-- Name: empleados_id_seq; Type: SEQUENCE OWNED BY; Schema: talento_humano; Owner: postgres
--

ALTER SEQUENCE empleados_id_seq OWNED BY empleados.id;


--
-- Name: empleados_personas; Type: VIEW; Schema: talento_humano; Owner: postgres
--

CREATE VIEW empleados_personas AS
 SELECT empleados.id_persona,
    empleados.id AS id_empleados,
    personas_documentos_identificacion.numero_identificacion,
    personas.primer_nombre,
    personas.segundo_nombre,
    personas.primer_apellido,
    personas.segundo_apellido,
    personas_correo_electronico.correo_electronico
   FROM public.personas,
    public.personas_correo_electronico,
    public.personas_documentos_identificacion,
    empleados
  WHERE ((empleados.id_persona = personas.id) AND (personas_documentos_identificacion.id_persona = empleados.id_persona));


ALTER TABLE empleados_personas OWNER TO postgres;

--
-- Name: jornadas_de_trabajo; Type: TABLE; Schema: talento_humano; Owner: postgres
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


ALTER TABLE jornadas_de_trabajo OWNER TO postgres;

--
-- Name: COLUMN jornadas_de_trabajo.hora_descanso; Type: COMMENT; Schema: talento_humano; Owner: postgres
--

COMMENT ON COLUMN jornadas_de_trabajo.hora_descanso IS 'ingresar el dato en minutos';


--
-- Name: jornadas_de_trabajo_id_seq; Type: SEQUENCE; Schema: talento_humano; Owner: postgres
--

CREATE SEQUENCE jornadas_de_trabajo_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE jornadas_de_trabajo_id_seq OWNER TO postgres;

--
-- Name: jornadas_de_trabajo_id_seq; Type: SEQUENCE OWNED BY; Schema: talento_humano; Owner: postgres
--

ALTER SEQUENCE jornadas_de_trabajo_id_seq OWNED BY jornadas_de_trabajo.id;


--
-- Name: tipos_contratos; Type: TABLE; Schema: talento_humano; Owner: postgres
--

CREATE TABLE tipos_contratos (
    id integer NOT NULL,
    nombre character varying(75) NOT NULL,
    descripcion character varying(2000) NOT NULL,
    estado character varying(5) NOT NULL,
    fecha timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE tipos_contratos OWNER TO postgres;

--
-- Name: tipos_contratos_id_seq; Type: SEQUENCE; Schema: talento_humano; Owner: postgres
--

CREATE SEQUENCE tipos_contratos_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE tipos_contratos_id_seq OWNER TO postgres;

--
-- Name: tipos_contratos_id_seq; Type: SEQUENCE OWNED BY; Schema: talento_humano; Owner: postgres
--

ALTER SEQUENCE tipos_contratos_id_seq OWNED BY tipos_contratos.id;


SET search_path = taller_mecanico, pg_catalog;

--
-- Name: Aseguradora; Type: TABLE; Schema: taller_mecanico; Owner: postgres
--

CREATE TABLE "Aseguradora" (
    id integer NOT NULL,
    contacto json,
    id_empresa integer NOT NULL
);


ALTER TABLE "Aseguradora" OWNER TO postgres;

--
-- Name: Aseguradora_id_seq; Type: SEQUENCE; Schema: taller_mecanico; Owner: postgres
--

CREATE SEQUENCE "Aseguradora_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "Aseguradora_id_seq" OWNER TO postgres;

--
-- Name: Aseguradora_id_seq; Type: SEQUENCE OWNED BY; Schema: taller_mecanico; Owner: postgres
--

ALTER SEQUENCE "Aseguradora_id_seq" OWNED BY "Aseguradora".id;


SET search_path = usuarios, pg_catalog;

--
-- Name: tipo_usuario; Type: TABLE; Schema: usuarios; Owner: postgres
--

CREATE TABLE tipo_usuario (
    id integer NOT NULL,
    nombre character varying(75) NOT NULL,
    descripcion character varying(500) NOT NULL,
    estado character varying(5) NOT NULL,
    fecha time with time zone DEFAULT now() NOT NULL
);


ALTER TABLE tipo_usuario OWNER TO postgres;

--
-- Name: tipo_usuario_id_seq; Type: SEQUENCE; Schema: usuarios; Owner: postgres
--

CREATE SEQUENCE tipo_usuario_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE tipo_usuario_id_seq OWNER TO postgres;

--
-- Name: tipo_usuario_id_seq; Type: SEQUENCE OWNED BY; Schema: usuarios; Owner: postgres
--

ALTER SEQUENCE tipo_usuario_id_seq OWNED BY tipo_usuario.id;


--
-- Name: usuarios; Type: TABLE; Schema: usuarios; Owner: postgres
--

CREATE TABLE usuarios (
    id character varying(75) NOT NULL,
    nick character varying(50) NOT NULL,
    clave_clave character varying(75),
    id_estado character varying(5),
    fecha_creacion timestamp with time zone,
    estado_clave boolean DEFAULT true NOT NULL,
    id_tipo_usuario integer NOT NULL,
    id_persona integer,
    fecha_actualiza timestamp without time zone DEFAULT now() NOT NULL,
    fecha_ultimo_cambio timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE usuarios OWNER TO postgres;

--
-- Name: COLUMN usuarios.id; Type: COMMENT; Schema: usuarios; Owner: postgres
--

COMMENT ON COLUMN usuarios.id IS 'id usuario del sistema Nexbook';


--
-- Name: COLUMN usuarios.clave_clave; Type: COMMENT; Schema: usuarios; Owner: postgres
--

COMMENT ON COLUMN usuarios.clave_clave IS 'define la clave del usuario';


--
-- Name: COLUMN usuarios.id_estado; Type: COMMENT; Schema: usuarios; Owner: postgres
--

COMMENT ON COLUMN usuarios.id_estado IS 'estado del usuario';


--
-- Name: COLUMN usuarios.fecha_creacion; Type: COMMENT; Schema: usuarios; Owner: postgres
--

COMMENT ON COLUMN usuarios.fecha_creacion IS 'fecha en la que fue creado el usuario';


--
-- Name: COLUMN usuarios.id_persona; Type: COMMENT; Schema: usuarios; Owner: postgres
--

COMMENT ON COLUMN usuarios.id_persona IS 'Relaciona usuarios con persona';


--
-- Name: COLUMN usuarios.fecha_actualiza; Type: COMMENT; Schema: usuarios; Owner: postgres
--

COMMENT ON COLUMN usuarios.fecha_actualiza IS 'se define para marcar la fecha de peticon de claves por el usuario';


--
-- Name: COLUMN usuarios.fecha_ultimo_cambio; Type: COMMENT; Schema: usuarios; Owner: postgres
--

COMMENT ON COLUMN usuarios.fecha_ultimo_cambio IS 'se establese para cambios o esperas de nuevos interacciones';


SET search_path = ventas, pg_catalog;

--
-- Name: caja; Type: TABLE; Schema: ventas; Owner: postgres
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


ALTER TABLE caja OWNER TO postgres;

--
-- Name: caja_id_seq; Type: SEQUENCE; Schema: ventas; Owner: postgres
--

CREATE SEQUENCE caja_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE caja_id_seq OWNER TO postgres;

--
-- Name: caja_id_seq; Type: SEQUENCE OWNED BY; Schema: ventas; Owner: postgres
--

ALTER SEQUENCE caja_id_seq OWNED BY caja.id;


--
-- Name: caja_usuario; Type: TABLE; Schema: ventas; Owner: postgres
--

CREATE TABLE caja_usuario (
    id_caja integer NOT NULL,
    id_usuario character varying(75) NOT NULL,
    id_empleado integer NOT NULL,
    estado character varying(5) NOT NULL,
    fecha date DEFAULT now() NOT NULL
);


ALTER TABLE caja_usuario OWNER TO postgres;

--
-- Name: clave_factura; Type: TABLE; Schema: ventas; Owner: postgres
--

CREATE TABLE clave_factura (
    id integer NOT NULL,
    id_factura integer NOT NULL,
    clave_factura character varying(49) NOT NULL,
    estado character varying(5) NOT NULL,
    fecha timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE clave_factura OWNER TO postgres;

--
-- Name: clave_factura_id_seq; Type: SEQUENCE; Schema: ventas; Owner: postgres
--

CREATE SEQUENCE clave_factura_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE clave_factura_id_seq OWNER TO postgres;

--
-- Name: clave_factura_id_seq; Type: SEQUENCE OWNED BY; Schema: ventas; Owner: postgres
--

ALTER SEQUENCE clave_factura_id_seq OWNED BY clave_factura.id;


--
-- Name: detalle_factura; Type: TABLE; Schema: ventas; Owner: postgres
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


ALTER TABLE detalle_factura OWNER TO postgres;

--
-- Name: detalle_factura_id_seq; Type: SEQUENCE; Schema: ventas; Owner: postgres
--

CREATE SEQUENCE detalle_factura_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE detalle_factura_id_seq OWNER TO postgres;

--
-- Name: detalle_factura_id_seq; Type: SEQUENCE OWNED BY; Schema: ventas; Owner: postgres
--

ALTER SEQUENCE detalle_factura_id_seq OWNED BY detalle_factura.id;


--
-- Name: empleado_factura; Type: TABLE; Schema: ventas; Owner: postgres
--

CREATE TABLE empleado_factura (
    id_empleado integer NOT NULL,
    id_factura integer NOT NULL,
    fecha date DEFAULT now() NOT NULL
);


ALTER TABLE empleado_factura OWNER TO postgres;

--
-- Name: facturas; Type: TABLE; Schema: ventas; Owner: postgres
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


ALTER TABLE facturas OWNER TO postgres;

--
-- Name: facturas_id_seq; Type: SEQUENCE; Schema: ventas; Owner: postgres
--

CREATE SEQUENCE facturas_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE facturas_id_seq OWNER TO postgres;

--
-- Name: facturas_id_seq; Type: SEQUENCE OWNED BY; Schema: ventas; Owner: postgres
--

ALTER SEQUENCE facturas_id_seq OWNED BY facturas.id;


--
-- Name: formas_pago_facturas; Type: TABLE; Schema: ventas; Owner: postgres
--

CREATE TABLE formas_pago_facturas (
    id integer NOT NULL,
    id_factura integer NOT NULL,
    id_formas_pago integer NOT NULL
);


ALTER TABLE formas_pago_facturas OWNER TO postgres;

--
-- Name: formas_pago_facturas_id_seq; Type: SEQUENCE; Schema: ventas; Owner: postgres
--

CREATE SEQUENCE formas_pago_facturas_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE formas_pago_facturas_id_seq OWNER TO postgres;

--
-- Name: formas_pago_facturas_id_seq; Type: SEQUENCE OWNED BY; Schema: ventas; Owner: postgres
--

ALTER SEQUENCE formas_pago_facturas_id_seq OWNED BY formas_pago_facturas.id;


--
-- Name: formas_pago_id_seq; Type: SEQUENCE; Schema: ventas; Owner: postgres
--

CREATE SEQUENCE formas_pago_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE formas_pago_id_seq OWNER TO postgres;

--
-- Name: formas_pago_id_seq; Type: SEQUENCE OWNED BY; Schema: ventas; Owner: postgres
--

ALTER SEQUENCE formas_pago_id_seq OWNED BY formas_pago.id;


--
-- Name: producto_descuento; Type: TABLE; Schema: ventas; Owner: postgres
--

CREATE TABLE producto_descuento (
    id integer NOT NULL,
    id_producto integer NOT NULL,
    id_catalogo integer NOT NULL,
    estado character varying(5) NOT NULL,
    fecha_fin_descuento timestamp with time zone NOT NULL,
    fecha_inicio_descuento timestamp with time zone NOT NULL
);


ALTER TABLE producto_descuento OWNER TO postgres;

--
-- Name: producto_descuento_id_seq; Type: SEQUENCE; Schema: ventas; Owner: postgres
--

CREATE SEQUENCE producto_descuento_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE producto_descuento_id_seq OWNER TO postgres;

--
-- Name: producto_descuento_id_seq; Type: SEQUENCE OWNED BY; Schema: ventas; Owner: postgres
--

ALTER SEQUENCE producto_descuento_id_seq OWNED BY producto_descuento.id;


SET search_path = administracion, pg_catalog;

--
-- Name: id; Type: DEFAULT; Schema: administracion; Owner: postgres
--

ALTER TABLE ONLY actividad_economica ALTER COLUMN id SET DEFAULT nextval('actividad_economica_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: administracion; Owner: postgres
--

ALTER TABLE ONLY empresas ALTER COLUMN id SET DEFAULT nextval('empresas_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: administracion; Owner: postgres
--

ALTER TABLE ONLY imagen_empresa ALTER COLUMN id SET DEFAULT nextval('imagen_empresa_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: administracion; Owner: postgres
--

ALTER TABLE ONLY informacion_empresa_tbl ALTER COLUMN id SET DEFAULT nextval('informacion_empresa_tbl_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: administracion; Owner: postgres
--

ALTER TABLE ONLY sucursal_actividad_economica_tbl ALTER COLUMN id SET DEFAULT nextval('sucursal_actividad_economica_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: administracion; Owner: postgres
--

ALTER TABLE ONLY tipo_accion_vista ALTER COLUMN id SET DEFAULT nextval('tipo_accion_vista_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: administracion; Owner: postgres
--

ALTER TABLE ONLY tipo_bienes_servicios ALTER COLUMN id SET DEFAULT nextval('tipo_bienes_servicios_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: administracion; Owner: postgres
--

ALTER TABLE ONLY tipo_empresa ALTER COLUMN id SET DEFAULT nextval('tipo_empresa_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: administracion; Owner: postgres
--

ALTER TABLE ONLY tipos_imagenes_empresas ALTER COLUMN id SET DEFAULT nextval('tipos_imagenes_empresas_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: administracion; Owner: postgres
--

ALTER TABLE ONLY usuarios_privilegios ALTER COLUMN id SET DEFAULT nextval('usuarios_privilegios_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: administracion; Owner: postgres
--

ALTER TABLE ONLY vistas ALTER COLUMN id SET DEFAULT nextval('vistas_id_seq'::regclass);


SET search_path = auditoria, pg_catalog;

--
-- Name: id; Type: DEFAULT; Schema: auditoria; Owner: postgres
--

ALTER TABLE ONLY auditoria ALTER COLUMN id SET DEFAULT nextval('auditoria_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: auditoria; Owner: postgres
--

ALTER TABLE ONLY ingresos_usuarios ALTER COLUMN id SET DEFAULT nextval('ingresos_usuarios_id_seq'::regclass);


SET search_path = contabilidad, pg_catalog;

--
-- Name: id; Type: DEFAULT; Schema: contabilidad; Owner: postgres
--

ALTER TABLE ONLY ambitos_impuestos ALTER COLUMN id SET DEFAULT nextval('ambitos_impuestos_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: contabilidad; Owner: postgres
--

ALTER TABLE ONLY asientos_contables_diario ALTER COLUMN id SET DEFAULT nextval('asientos_contables_diario_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: contabilidad; Owner: postgres
--

ALTER TABLE ONLY bancos ALTER COLUMN id SET DEFAULT nextval('bancos_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: contabilidad; Owner: postgres
--

ALTER TABLE ONLY cuentas_contables ALTER COLUMN id SET DEFAULT nextval('cuentas_contables_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: contabilidad; Owner: postgres
--

ALTER TABLE ONLY finaciaminto ALTER COLUMN id SET DEFAULT nextval('finaciaminto_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: contabilidad; Owner: postgres
--

ALTER TABLE ONLY gasto_mes_repositorio ALTER COLUMN id SET DEFAULT nextval('gasto_mes_repositorio_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: contabilidad; Owner: postgres
--

ALTER TABLE ONLY gastos_impuestos_renta_deduccion ALTER COLUMN id SET DEFAULT nextval('gastos_impuestos_renta_deduccion_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: contabilidad; Owner: postgres
--

ALTER TABLE ONLY grupo_impuestos ALTER COLUMN id SET DEFAULT nextval('grupo_impuestos_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: contabilidad; Owner: postgres
--

ALTER TABLE ONLY impuestos ALTER COLUMN id SET DEFAULT nextval('impuestos_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: contabilidad; Owner: postgres
--

ALTER TABLE ONLY plazos_credito ALTER COLUMN id SET DEFAULT nextval('"Plazos_credito_id_seq"'::regclass);


--
-- Name: id_factura; Type: DEFAULT; Schema: contabilidad; Owner: postgres
--

ALTER TABLE ONLY repositorio_facturas ALTER COLUMN id_factura SET DEFAULT nextval('repositorio_facturas_id_factura_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: contabilidad; Owner: postgres
--

ALTER TABLE ONLY repositorio_facturas_correo ALTER COLUMN id SET DEFAULT nextval('facturas_correo_id_seq'::regclass);


--
-- Name: id_factura_r; Type: DEFAULT; Schema: contabilidad; Owner: postgres
--

ALTER TABLE ONLY repositorio_facturas_rechazadas ALTER COLUMN id_factura_r SET DEFAULT nextval('repositorio_facturas_rechazadas_id_factura_r_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: contabilidad; Owner: postgres
--

ALTER TABLE ONLY rol_pagos_empleados ALTER COLUMN id SET DEFAULT nextval('rol_pagos_empleados_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: contabilidad; Owner: postgres
--

ALTER TABLE ONLY tipo_impuestos ALTER COLUMN id SET DEFAULT nextval('tipo_impuestos_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: contabilidad; Owner: postgres
--

ALTER TABLE ONLY tipos_cuentas_contables ALTER COLUMN id SET DEFAULT nextval('tipo_cuenta_contable_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: contabilidad; Owner: postgres
--

ALTER TABLE ONLY tipos_gastos_personales ALTER COLUMN id SET DEFAULT nextval('tipos_gastos_personales_id_seq'::regclass);


SET search_path = inventario, pg_catalog;

--
-- Name: id; Type: DEFAULT; Schema: inventario; Owner: postgres
--

ALTER TABLE ONLY bodegas ALTER COLUMN id SET DEFAULT nextval('bodegas_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: inventario; Owner: postgres
--

ALTER TABLE ONLY catalogos ALTER COLUMN id SET DEFAULT nextval('catalogos_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: inventario; Owner: postgres
--

ALTER TABLE ONLY categorias ALTER COLUMN id SET DEFAULT nextval('categorias_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: inventario; Owner: postgres
--

ALTER TABLE ONLY descripcion_producto ALTER COLUMN id SET DEFAULT nextval('descripcion_producto_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: inventario; Owner: postgres
--

ALTER TABLE ONLY estado_descriptivo ALTER COLUMN id SET DEFAULT nextval('estado_descriptivo_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: inventario; Owner: postgres
--

ALTER TABLE ONLY garantias ALTER COLUMN id SET DEFAULT nextval('garantias_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: inventario; Owner: postgres
--

ALTER TABLE ONLY manejo_presios ALTER COLUMN id SET DEFAULT nextval('manejo_presios_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: inventario; Owner: postgres
--

ALTER TABLE ONLY marcas ALTER COLUMN id SET DEFAULT nextval('marcas_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: inventario; Owner: postgres
--

ALTER TABLE ONLY modelos ALTER COLUMN id SET DEFAULT nextval('modelos_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: inventario; Owner: postgres
--

ALTER TABLE ONLY productos ALTER COLUMN id SET DEFAULT nextval('productos_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: inventario; Owner: postgres
--

ALTER TABLE ONLY productos_impuestos ALTER COLUMN id SET DEFAULT nextval('productos_impuestos_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: inventario; Owner: postgres
--

ALTER TABLE ONLY proveedores ALTER COLUMN id SET DEFAULT nextval('proveedores_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: inventario; Owner: postgres
--

ALTER TABLE ONLY tipo_consumo ALTER COLUMN id SET DEFAULT nextval('tipo_consumo_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: inventario; Owner: postgres
--

ALTER TABLE ONLY tipos_catalogos ALTER COLUMN id SET DEFAULT nextval('tipos_catalogos_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: inventario; Owner: postgres
--

ALTER TABLE ONLY tipos_categorias ALTER COLUMN id SET DEFAULT nextval('tipos_categorias_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: inventario; Owner: postgres
--

ALTER TABLE ONLY tipos_garantias ALTER COLUMN id SET DEFAULT nextval('tipos_garantias_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: inventario; Owner: postgres
--

ALTER TABLE ONLY tipos_imagenes_productos ALTER COLUMN id SET DEFAULT nextval('tipos_imagenes_productos_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: inventario; Owner: postgres
--

ALTER TABLE ONLY tipos_productos ALTER COLUMN id SET DEFAULT nextval('tipos_productos_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: inventario; Owner: postgres
--

ALTER TABLE ONLY tipos_tipo_consumo ALTER COLUMN id SET DEFAULT nextval('tipos_tipo_consumo_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: inventario; Owner: postgres
--

ALTER TABLE ONLY ubicaciones ALTER COLUMN id SET DEFAULT nextval('ubicaciones_id_seq'::regclass);


SET search_path = public, pg_catalog;

--
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY operadoras_telefonicas ALTER COLUMN id SET DEFAULT nextval('operadoras_telefonicas_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY personas ALTER COLUMN id SET DEFAULT nextval('personas_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY personas_correo_electronico ALTER COLUMN id SET DEFAULT nextval('personas_correo_electronico_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY personas_documentos_identificacion ALTER COLUMN id SET DEFAULT nextval('personas_documentos_identificacion_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY telefonos_personas ALTER COLUMN id SET DEFAULT nextval('telefonos_personas_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY tipo_documento_identificacion ALTER COLUMN id SET DEFAULT nextval('tipo_documento_identificaion_id_seq'::regclass);


SET search_path = talento_humano, pg_catalog;

--
-- Name: id; Type: DEFAULT; Schema: talento_humano; Owner: postgres
--

ALTER TABLE ONLY cargos ALTER COLUMN id SET DEFAULT nextval('cargos_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: talento_humano; Owner: postgres
--

ALTER TABLE ONLY empleados ALTER COLUMN id SET DEFAULT nextval('empleados_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: talento_humano; Owner: postgres
--

ALTER TABLE ONLY jornadas_de_trabajo ALTER COLUMN id SET DEFAULT nextval('jornadas_de_trabajo_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: talento_humano; Owner: postgres
--

ALTER TABLE ONLY tipos_contratos ALTER COLUMN id SET DEFAULT nextval('tipos_contratos_id_seq'::regclass);


SET search_path = taller_mecanico, pg_catalog;

--
-- Name: id; Type: DEFAULT; Schema: taller_mecanico; Owner: postgres
--

ALTER TABLE ONLY "Aseguradora" ALTER COLUMN id SET DEFAULT nextval('"Aseguradora_id_seq"'::regclass);


SET search_path = usuarios, pg_catalog;

--
-- Name: id; Type: DEFAULT; Schema: usuarios; Owner: postgres
--

ALTER TABLE ONLY tipo_usuario ALTER COLUMN id SET DEFAULT nextval('tipo_usuario_id_seq'::regclass);


SET search_path = ventas, pg_catalog;

--
-- Name: id; Type: DEFAULT; Schema: ventas; Owner: postgres
--

ALTER TABLE ONLY caja ALTER COLUMN id SET DEFAULT nextval('caja_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: ventas; Owner: postgres
--

ALTER TABLE ONLY clave_factura ALTER COLUMN id SET DEFAULT nextval('clave_factura_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: ventas; Owner: postgres
--

ALTER TABLE ONLY detalle_factura ALTER COLUMN id SET DEFAULT nextval('detalle_factura_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: ventas; Owner: postgres
--

ALTER TABLE ONLY facturas ALTER COLUMN id SET DEFAULT nextval('facturas_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: ventas; Owner: postgres
--

ALTER TABLE ONLY formas_pago ALTER COLUMN id SET DEFAULT nextval('formas_pago_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: ventas; Owner: postgres
--

ALTER TABLE ONLY formas_pago_facturas ALTER COLUMN id SET DEFAULT nextval('formas_pago_facturas_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: ventas; Owner: postgres
--

ALTER TABLE ONLY producto_descuento ALTER COLUMN id SET DEFAULT nextval('producto_descuento_id_seq'::regclass);


SET search_path = administracion, pg_catalog;

--
-- Data for Name: actividad_economica; Type: TABLE DATA; Schema: administracion; Owner: postgres
--

COPY actividad_economica (id, nombre, descripcion, id_tipo_bienes_servicios, estado, fecha, imagen) FROM stdin;
\.


--
-- Name: actividad_economica_id_seq; Type: SEQUENCE SET; Schema: administracion; Owner: postgres
--

SELECT pg_catalog.setval('actividad_economica_id_seq', 1, false);


--
-- Data for Name: clientes; Type: TABLE DATA; Schema: administracion; Owner: postgres
--

COPY clientes (id, tipo_cliente, id_cliente, id_tipo_documento, fecha, estado) FROM stdin;
\.


--
-- Data for Name: empresas; Type: TABLE DATA; Schema: administracion; Owner: postgres
--

COPY empresas (id, razon_social, actividad_economica, ruc_ci, nombre_comercial, tipo_persona, id_estado, fecha, tipo_empresa) FROM stdin;
\.


--
-- Name: empresas_id_seq; Type: SEQUENCE SET; Schema: administracion; Owner: postgres
--

SELECT pg_catalog.setval('empresas_id_seq', 1, false);


--
-- Data for Name: imagen_empresa; Type: TABLE DATA; Schema: administracion; Owner: postgres
--

COPY imagen_empresa (id, sucursal, direccion_imagen_empresa, direccion_imagen_recorte, estado, fecha, tipo_imagen) FROM stdin;
\.


--
-- Name: imagen_empresa_id_seq; Type: SEQUENCE SET; Schema: administracion; Owner: postgres
--

SELECT pg_catalog.setval('imagen_empresa_id_seq', 1, false);


--
-- Data for Name: informacion_empresa_tbl; Type: TABLE DATA; Schema: administracion; Owner: postgres
--

COPY informacion_empresa_tbl (id, id_empresa, id_tipo_empresa, id_sucursal, mision, vision, slogan, valores_institucionales, telefonos, correos, estado, fecha_creacion, fecha_ultimo_cambio) FROM stdin;
\.


--
-- Name: informacion_empresa_tbl_id_seq; Type: SEQUENCE SET; Schema: administracion; Owner: postgres
--

SELECT pg_catalog.setval('informacion_empresa_tbl_id_seq', 1, false);


--
-- Name: sucursal_actividad_economica_id_seq; Type: SEQUENCE SET; Schema: administracion; Owner: postgres
--

SELECT pg_catalog.setval('sucursal_actividad_economica_id_seq', 1, false);


--
-- Data for Name: sucursal_actividad_economica_tbl; Type: TABLE DATA; Schema: administracion; Owner: postgres
--

COPY sucursal_actividad_economica_tbl (id, id_sucursal, id_actividad_economica, estado, fecha_creacion, fecha_ultimo_cambio) FROM stdin;
\.


--
-- Data for Name: sucursales; Type: TABLE DATA; Schema: administracion; Owner: postgres
--

COPY sucursales (id, nombre, responsable, datos_empresariales, localizacion_sucursal, datos_adiconales, codigo_sri, giro_negocio, actividad_economica, id_empresa, fecha_creacion, fecha_ultima_mod) FROM stdin;
\.


--
-- Name: sucursales_id_seq; Type: SEQUENCE SET; Schema: administracion; Owner: postgres
--

SELECT pg_catalog.setval('sucursales_id_seq', 1, false);


--
-- Data for Name: tipo_accion_vista; Type: TABLE DATA; Schema: administracion; Owner: postgres
--

COPY tipo_accion_vista (id, accion_ver, accion_guardar, accion_modificar, estado, fecha) FROM stdin;
1	t	t	t	A	2017-10-31 10:46:42.308461
\.


--
-- Name: tipo_accion_vista_id_seq; Type: SEQUENCE SET; Schema: administracion; Owner: postgres
--

SELECT pg_catalog.setval('tipo_accion_vista_id_seq', 1, true);


--
-- Data for Name: tipo_bienes_servicios; Type: TABLE DATA; Schema: administracion; Owner: postgres
--

COPY tipo_bienes_servicios (id, nombre, descripcion, fecha, estado, id_prestacion) FROM stdin;
0	Falta definir	solicita definir tipo de giro de negocio	2017-03-21 15:53:16.112294	A	\N
1	Bienes	El giro del negocio es la venta de Bienes	2017-12-06 10:13:31.853682	A	\N
2	Servicios	El giro del negocio es de bienes y servicios	2017-12-06 10:15:44.349654	A	\N
3	Bienes & Servicios	El giro del negocio es de bienes y servicios	2017-12-06 10:16:37.457946	A	\N
\.


--
-- Name: tipo_bienes_servicios_id_seq; Type: SEQUENCE SET; Schema: administracion; Owner: postgres
--

SELECT pg_catalog.setval('tipo_bienes_servicios_id_seq', 5, true);


--
-- Data for Name: tipo_empresa; Type: TABLE DATA; Schema: administracion; Owner: postgres
--

COPY tipo_empresa (id, nombre, descripcion, estado, fecha) FROM stdin;
2	Sucursal                                          	Sucursal de la empresa	A	2017-04-17 15:05:41.539454
3	Cleinte                                           	Empresas Clientes	A	2017-12-08 08:01:07.113793
0	Propia                                            	Empresa Propietaria del Sistema	A	2017-04-17 15:05:22.37072
4	Proveedor                                         	Empresa Proveedora	A	2017-12-08 08:02:51.864457
\.


--
-- Name: tipo_empresa_id_seq; Type: SEQUENCE SET; Schema: administracion; Owner: postgres
--

SELECT pg_catalog.setval('tipo_empresa_id_seq', 5, true);


--
-- Data for Name: tipos_imagenes_empresas; Type: TABLE DATA; Schema: administracion; Owner: postgres
--

COPY tipos_imagenes_empresas (id, nombre, estado, fecha) FROM stdin;
1	PORTADA	A	2017-05-18 10:25:13.384762-05
2	PERFIL	A	2017-05-18 10:25:29.059976-05
3	FRONTAL	A	2017-05-18 10:25:40.058242-05
0	PENDIENTE	A	2017-05-18 10:25:50.510283-05
4	PORTADA USUARIO	A	2017-11-23 12:13:58.545446-05
5	PERFIL USUARIO	A	2017-11-23 12:13:58.545446-05
6	FRONTAL USUARIIO	A	2017-11-23 12:13:58.545446-05
7	PORTADA EMPRESA	A	2017-12-08 08:25:17.911762-05
8	PERFIL EMPRESA	A	2017-12-08 08:25:29.363599-05
9	FRONTAL EMPRESA	A	2017-12-08 08:25:44.44426-05
\.


--
-- Name: tipos_imagenes_empresas_id_seq; Type: SEQUENCE SET; Schema: administracion; Owner: postgres
--

SELECT pg_catalog.setval('tipos_imagenes_empresas_id_seq', 9, true);


--
-- Data for Name: usuarios_privilegios; Type: TABLE DATA; Schema: administracion; Owner: postgres
--

COPY usuarios_privilegios (id, estado, fecha, id_vista, id_tipo_usuario, id_tipo_accion_vistas) FROM stdin;
\.


--
-- Name: usuarios_privilegios_id_seq; Type: SEQUENCE SET; Schema: administracion; Owner: postgres
--

SELECT pg_catalog.setval('usuarios_privilegios_id_seq', 1, false);


--
-- Data for Name: vistas; Type: TABLE DATA; Schema: administracion; Owner: postgres
--

COPY vistas (id, nombre, path, url, personalizacion, estado, id_padre, nivel_arbol, template_, controller_, fecha) FROM stdin;
\.


--
-- Name: vistas_id_seq; Type: SEQUENCE SET; Schema: administracion; Owner: postgres
--

SELECT pg_catalog.setval('vistas_id_seq', 1, false);


SET search_path = auditoria, pg_catalog;

--
-- Data for Name: auditoria; Type: TABLE DATA; Schema: auditoria; Owner: postgres
--

COPY auditoria (id, tabla_afectada, operacion, variable_anterior, variable_nueva, fecha, usuario) FROM stdin;
3	cargos                                       	U	(1,Administrador,,"2017-05-18 15:28:06.929823",)	(1,Administrador,A,"2017-05-18 15:28:06.929823",)	2017-05-18 15:28:39.964714	postgres                                     
4	cargos                                       	U	(1,Administrador,A,"2017-05-18 15:28:06.929823",)	(1,Administrador,A,"2017-05-18 15:28:06.929823",0)	2017-05-18 15:29:04.993192	postgres                                     
5	usuarios                                     	I	\N	("usuario prueba 1",prueba,123455,A,,t,1)	2017-06-05 12:45:38.91663	postgres                                     
6	empleados                                    	I	\N	(6,1,A,"2017-06-05 12:46:35.094297-05","usuario prueba 1",)	2017-06-05 12:46:35.094297	postgres                                     
7	empleados                                    	U	(6,1,A,"2017-06-05 12:46:35.094297-05","usuario prueba 1",)	(1,1,A,"2017-06-05 12:46:35.094297-05","usuario prueba 1",)	2017-06-05 12:46:52.813799	postgres                                     
8	tipo_accion_vista                            	I	\N	(1,t,t,t,A,"2017-10-31 10:46:42.308461")	2017-10-31 10:46:42.308461	postgres                                     
9	estados                                      	I	\N	(KPC,"Pendiente Cambio","La clave esta pendiente de ser Cambida",2017-12-02)	2017-12-02 13:32:27.570609	postgres                                     
10	tipo_bienes_servicios                        	I	\N	(7,Bienes,"El giro del negocio es la venta de Bienes","2017-12-06 10:13:31.853682",A,)	2017-12-06 10:13:31.853682	postgres                                     
11	tipo_bienes_servicios                        	U	(7,Bienes,"El giro del negocio es la venta de Bienes","2017-12-06 10:13:31.853682",A,)	(1,Bienes,"El giro del negocio es la venta de Bienes","2017-12-06 10:13:31.853682",A,)	2017-12-06 10:14:56.254309	postgres                                     
12	tipo_bienes_servicios                        	I	\N	(2,Servicios,"El giro del negocio es de bienes y servicios","2017-12-06 10:15:44.349654",A,)	2017-12-06 10:15:44.349654	postgres                                     
13	tipo_bienes_servicios                        	I	\N	(3,"Bienes & Servicios","El giro del negocio es de bienes y servicios","2017-12-06 10:16:37.457946",A,)	2017-12-06 10:16:37.457946	postgres                                     
14	tipo_empresa                                 	U	(1,"Cliente                                           ","empresa cliente",A,"2017-04-17 15:05:41.539454")	(2,"Sucursal                                          ","Sucursal de la empresa",A,"2017-04-17 15:05:41.539454")	2017-12-08 08:00:40.047096	postgres                                     
15	tipo_empresa                                 	U	(0,"Propia                                            ","la empresa propietaria de la BDD",A,"2017-04-17 15:05:22.37072")	(0,"Propia                                            ","Empresa propietaria de la BDD",A,"2017-04-17 15:05:22.37072")	2017-12-08 08:00:46.102008	postgres                                     
16	tipo_empresa                                 	I	\N	(3,"Cleinte                                           ","Empresas Clientes",A,"2017-12-08 08:01:07.113793")	2017-12-08 08:01:07.113793	postgres                                     
17	tipo_empresa                                 	U	(0,"Propia                                            ","Empresa propietaria de la BDD",A,"2017-04-17 15:05:22.37072")	(0,"Propia                                            ","Empresa Propietaria del Sistema",A,"2017-04-17 15:05:22.37072")	2017-12-08 08:02:30.354737	postgres                                     
18	tipo_empresa                                 	I	\N	(4,"Proveedor                                         ","Empresa Proveedora",A,"2017-12-08 08:02:51.864457")	2017-12-08 08:02:51.864457	postgres                                     
\.


--
-- Name: auditoria_id_seq; Type: SEQUENCE SET; Schema: auditoria; Owner: postgres
--

SELECT pg_catalog.setval('auditoria_id_seq', 18, true);


--
-- Data for Name: ingresos_usuarios; Type: TABLE DATA; Schema: auditoria; Owner: postgres
--

COPY ingresos_usuarios (id, usuario, informacion_servidor, fecha, ip_acceso) FROM stdin;
\.


--
-- Name: ingresos_usuarios_id_seq; Type: SEQUENCE SET; Schema: auditoria; Owner: postgres
--

SELECT pg_catalog.setval('ingresos_usuarios_id_seq', 2, true);


SET search_path = contabilidad, pg_catalog;

--
-- Name: Plazos_credito_id_seq; Type: SEQUENCE SET; Schema: contabilidad; Owner: postgres
--

SELECT pg_catalog.setval('"Plazos_credito_id_seq"', 1, false);


--
-- Data for Name: ambitos_impuestos; Type: TABLE DATA; Schema: contabilidad; Owner: postgres
--

COPY ambitos_impuestos (id, nombre, estado, fecha) FROM stdin;
4	VENTAS	A	2017-01-13
5	COMPRAS	A	2017-01-13
\.


--
-- Name: ambitos_impuestos_id_seq; Type: SEQUENCE SET; Schema: contabilidad; Owner: postgres
--

SELECT pg_catalog.setval('ambitos_impuestos_id_seq', 5, true);


--
-- Data for Name: asientos_contables_diario; Type: TABLE DATA; Schema: contabilidad; Owner: postgres
--

COPY asientos_contables_diario (id, id_tipo_cuenta_contable, referencia_asiento, debe, haber, fecha, estado) FROM stdin;
\.


--
-- Name: asientos_contables_diario_id_seq; Type: SEQUENCE SET; Schema: contabilidad; Owner: postgres
--

SELECT pg_catalog.setval('asientos_contables_diario_id_seq', 1, false);


--
-- Data for Name: bancos; Type: TABLE DATA; Schema: contabilidad; Owner: postgres
--

COPY bancos (id, nombre_banco, numero_cuanta, titular_cuenta, direccion_sucursal_banco, estado, fecha) FROM stdin;
\.


--
-- Name: bancos_id_seq; Type: SEQUENCE SET; Schema: contabilidad; Owner: postgres
--

SELECT pg_catalog.setval('bancos_id_seq', 1, false);


--
-- Data for Name: cuentas_contables; Type: TABLE DATA; Schema: contabilidad; Owner: postgres
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
-- Name: cuentas_contables_id_seq; Type: SEQUENCE SET; Schema: contabilidad; Owner: postgres
--

SELECT pg_catalog.setval('cuentas_contables_id_seq', 11, true);


--
-- Name: facturas_correo_id_seq; Type: SEQUENCE SET; Schema: contabilidad; Owner: postgres
--

SELECT pg_catalog.setval('facturas_correo_id_seq', 1, false);


--
-- Data for Name: fecha_declaracion_ruc; Type: TABLE DATA; Schema: contabilidad; Owner: postgres
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
-- Data for Name: finaciaminto; Type: TABLE DATA; Schema: contabilidad; Owner: postgres
--

COPY finaciaminto (id, id_factura, total_factura, pago_parcial, numero_cuotas, id_plazos_credito, fecha_prestamo, subtotal_sin_iva, subtotal_iva, iva, fecha_vencimiento, estado_pago, porcentaje_sin_iva, porcentaje_iva, porcentaje_con_iva) FROM stdin;
\.


--
-- Name: finaciaminto_id_seq; Type: SEQUENCE SET; Schema: contabilidad; Owner: postgres
--

SELECT pg_catalog.setval('finaciaminto_id_seq', 1, false);


--
-- Data for Name: gasto_mes_repositorio; Type: TABLE DATA; Schema: contabilidad; Owner: postgres
--

COPY gasto_mes_repositorio (id, id_factura, id_tipo_gasto, total_gasto, fecha, estado_revicion) FROM stdin;
\.


--
-- Name: gasto_mes_repositorio_id_seq; Type: SEQUENCE SET; Schema: contabilidad; Owner: postgres
--

SELECT pg_catalog.setval('gasto_mes_repositorio_id_seq', 1, false);


--
-- Data for Name: gastos_impuestos_renta_deduccion; Type: TABLE DATA; Schema: contabilidad; Owner: postgres
--

COPY gastos_impuestos_renta_deduccion (id, id_factura, id_tipo_gasto_personal, valor_acumular, estado, fecha) FROM stdin;
\.


--
-- Name: gastos_impuestos_renta_deduccion_id_seq; Type: SEQUENCE SET; Schema: contabilidad; Owner: postgres
--

SELECT pg_catalog.setval('gastos_impuestos_renta_deduccion_id_seq', 1, false);


--
-- Data for Name: genealogia_impuestos; Type: TABLE DATA; Schema: contabilidad; Owner: postgres
--

COPY genealogia_impuestos (id_impuesto_padre, id_impuesto_hijo) FROM stdin;
\.


--
-- Data for Name: grupo_impuestos; Type: TABLE DATA; Schema: contabilidad; Owner: postgres
--

COPY grupo_impuestos (id, nombre, estado, fecha) FROM stdin;
\.


--
-- Name: grupo_impuestos_id_seq; Type: SEQUENCE SET; Schema: contabilidad; Owner: postgres
--

SELECT pg_catalog.setval('grupo_impuestos_id_seq', 1, false);


--
-- Data for Name: impuestos; Type: TABLE DATA; Schema: contabilidad; Owner: postgres
--

COPY impuestos (id, codigo_sri, nombre, descripcion, cantidad, estado, fecha, ambito, tipo_impuesto) FROM stdin;
4	2	Porcentaje IVA 12%	Porcentaje IVA 12%	12	A	2017-01-17	4	0
2	0	Porcentaje IVA 0%	Porcentaje IVA 0%	0	A	2017-01-17	4	0
6	3	Porcentaje IVA 14%	Porcentaje IVA 14%	14	A	2017-01-17	4	0
8	6	No Objeto de Impuesto	No Objeto de Impuesto	0	A	2017-01-17	4	0
9	7	Exento de IVA	Exento de IVA	0	A	2017-01-17	4	0
\.


--
-- Name: impuestos_id_seq; Type: SEQUENCE SET; Schema: contabilidad; Owner: postgres
--

SELECT pg_catalog.setval('impuestos_id_seq', 9, true);


--
-- Data for Name: plazos_credito; Type: TABLE DATA; Schema: contabilidad; Owner: postgres
--

COPY plazos_credito (id, nombre, dias_credito, estado, fecha) FROM stdin;
\.


--
-- Data for Name: repositorio_facturas; Type: TABLE DATA; Schema: contabilidad; Owner: postgres
--

COPY repositorio_facturas (id_factura, num_factura, nombre_comercial, clave_acceso, ruc_prov, tipo_doc, total, contenido_fac, created_at, id_sucursal, fecha_emision, subtotal_12, subtotal_0, subtotal_no_sujeto, subtotal_exento_iva, subtotal_sin_impuestos, descuento, ice, iva_12, propina, estado, estado_view) FROM stdin;
\.


--
-- Data for Name: repositorio_facturas_correo; Type: TABLE DATA; Schema: contabilidad; Owner: postgres
--

COPY repositorio_facturas_correo (id, ruta_acceso, id_correo, estado_proceso_factura, emisor_factura, nombre_archivo, fecha, asunto) FROM stdin;
\.


--
-- Name: repositorio_facturas_id_factura_seq; Type: SEQUENCE SET; Schema: contabilidad; Owner: postgres
--

SELECT pg_catalog.setval('repositorio_facturas_id_factura_seq', 1, false);


--
-- Data for Name: repositorio_facturas_rechazadas; Type: TABLE DATA; Schema: contabilidad; Owner: postgres
--

COPY repositorio_facturas_rechazadas (id_factura_r, clave_acceso, razon_rechazo, created_at, estado, contenido_correo, emisor_factura, asunto) FROM stdin;
\.


--
-- Name: repositorio_facturas_rechazadas_id_factura_r_seq; Type: SEQUENCE SET; Schema: contabilidad; Owner: postgres
--

SELECT pg_catalog.setval('repositorio_facturas_rechazadas_id_factura_r_seq', 6, true);


--
-- Data for Name: rol_pagos_empleados; Type: TABLE DATA; Schema: contabilidad; Owner: postgres
--

COPY rol_pagos_empleados (id, id_empleado, mes_pago) FROM stdin;
\.


--
-- Name: rol_pagos_empleados_id_seq; Type: SEQUENCE SET; Schema: contabilidad; Owner: postgres
--

SELECT pg_catalog.setval('rol_pagos_empleados_id_seq', 4, true);


--
-- Name: tipo_cuenta_contable_id_seq; Type: SEQUENCE SET; Schema: contabilidad; Owner: postgres
--

SELECT pg_catalog.setval('tipo_cuenta_contable_id_seq', 2, true);


--
-- Data for Name: tipo_documentos; Type: TABLE DATA; Schema: contabilidad; Owner: postgres
--

COPY tipo_documentos (id, nombre, descripcion, estado, fecha) FROM stdin;
01	FACTURA	FACTURA	A	2017-01-17 15:12:08
04	NOTA DE CRÉDITO	NOTA DE CRÉDITO	A	2017-01-17 15:13:51
05	NOTA DE DÉBITO	NOTA DE DÉBITO	A	2017-01-17 15:15:28
06	GUÍA DE REMISIÓN	GUÍA DE REMISIÓN	A	2017-01-17 15:16:04
07	COMPROBANTE DE RETENCIÓN	COMPROBANTE DE RETENCIÓN	A	2017-01-17 15:16:28
\.


--
-- Data for Name: tipo_impuestos; Type: TABLE DATA; Schema: contabilidad; Owner: postgres
--

COPY tipo_impuestos (id, nombre, descripcion, estado, fecha) FROM stdin;
0	no definido	no definido	A	2017-04-12 17:32:55
1	IVA	Impuesto al valor Agregado	A	2017-04-17 17:20:30
2	ICE	Impuestos Consumos Especiales	A	2017-04-17 17:21:11
\.


--
-- Name: tipo_impuestos_id_seq; Type: SEQUENCE SET; Schema: contabilidad; Owner: postgres
--

SELECT pg_catalog.setval('tipo_impuestos_id_seq', 1, false);


--
-- Data for Name: tipos_cuentas_contables; Type: TABLE DATA; Schema: contabilidad; Owner: postgres
--

COPY tipos_cuentas_contables (id, nombre, descripcion, estado, fecha) FROM stdin;
1	CUENTAS REALES	Se utilizan en el estado de situacion financiero	A	2017-01-20 11:50:11.866106
2	CUENTAS NOMINALES	Se utilizan para el estado de perdidas o ganancias	A	2017-01-20 11:51:08.976658
\.


--
-- Data for Name: tipos_gastos_personales; Type: TABLE DATA; Schema: contabilidad; Owner: postgres
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
-- Name: tipos_gastos_personales_id_seq; Type: SEQUENCE SET; Schema: contabilidad; Owner: postgres
--

SELECT pg_catalog.setval('tipos_gastos_personales_id_seq', 1, false);


SET search_path = inventario, pg_catalog;

--
-- Data for Name: bodegas; Type: TABLE DATA; Schema: inventario; Owner: postgres
--

COPY bodegas (id, id_sucursal, nombre, calle, numero, especificaciones, fecha, estado, giro_negocio) FROM stdin;
\.


--
-- Name: bodegas_id_seq; Type: SEQUENCE SET; Schema: inventario; Owner: postgres
--

SELECT pg_catalog.setval('bodegas_id_seq', 1, false);


--
-- Data for Name: catalogos; Type: TABLE DATA; Schema: inventario; Owner: postgres
--

COPY catalogos (id, tipo_catalogo, producto) FROM stdin;
\.


--
-- Name: catalogos_id_seq; Type: SEQUENCE SET; Schema: inventario; Owner: postgres
--

SELECT pg_catalog.setval('catalogos_id_seq', 1, false);


--
-- Data for Name: categorias; Type: TABLE DATA; Schema: inventario; Owner: postgres
--

COPY categorias (id, nombre, descripcion, tipo_categoria, estado, fecha, id_padre) FROM stdin;
1	Sin Categoria	No tiene una categoria	1	A	2017-02-17 09:04:57.818015-05	0
\.


--
-- Name: categorias_id_seq; Type: SEQUENCE SET; Schema: inventario; Owner: postgres
--

SELECT pg_catalog.setval('categorias_id_seq', 3, true);


--
-- Data for Name: descripcion_producto; Type: TABLE DATA; Schema: inventario; Owner: postgres
--

COPY descripcion_producto (id, producto, descripcion_corta, descripcion_proveedor, descripcion_proformas, descripcion_movi_inventa) FROM stdin;
\.


--
-- Name: descripcion_producto_id_seq; Type: SEQUENCE SET; Schema: inventario; Owner: postgres
--

SELECT pg_catalog.setval('descripcion_producto_id_seq', 1, false);


--
-- Data for Name: estado_descriptivo; Type: TABLE DATA; Schema: inventario; Owner: postgres
--

COPY estado_descriptivo (id, nombre, descripcion, estado, fecha, id_padre) FROM stdin;
1	Productos	se aplican a productos	A	2017-04-26 10:52:56.572459-05	0
5	Baja	Producto que cumplieron su vida util	A	2017-04-03 14:58:11.388408-05	1
4	Defectuoso	Productos que stan defectuosos de fabrica	A	2017-04-03 14:56:14.175912-05	1
3	Usado	PRoductos o bienes nuevos	A	2017-04-03 14:55:39.280521-05	1
2	Nuevo	Productos o Bienes nuevos	A	2017-03-14 09:48:18.227251-05	1
\.


--
-- Name: estado_descriptivo_id_seq; Type: SEQUENCE SET; Schema: inventario; Owner: postgres
--

SELECT pg_catalog.setval('estado_descriptivo_id_seq', 5, true);


--
-- Data for Name: garantias; Type: TABLE DATA; Schema: inventario; Owner: postgres
--

COPY garantias (id, nombre, descripcion, estado, fecha, tipo_garantia, duracion, id_padre) FROM stdin;
1	Sin garantia	No tiene garantia	A	2017-02-17 09:06:43.824581-05	1	0	0
\.


--
-- Name: garantias_id_seq; Type: SEQUENCE SET; Schema: inventario; Owner: postgres
--

SELECT pg_catalog.setval('garantias_id_seq', 3, true);


--
-- Data for Name: imagenes_productos; Type: TABLE DATA; Schema: inventario; Owner: postgres
--

COPY imagenes_productos (id, nombre, direccion, tipo_imagen, estado, fecha, producto) FROM stdin;
\.


--
-- Data for Name: manejo_presios; Type: TABLE DATA; Schema: inventario; Owner: postgres
--

COPY manejo_presios (id, id_producto, nombre, valor_precio, estado, fecha) FROM stdin;
\.


--
-- Name: manejo_presios_id_seq; Type: SEQUENCE SET; Schema: inventario; Owner: postgres
--

SELECT pg_catalog.setval('manejo_presios_id_seq', 1, false);


--
-- Data for Name: marcas; Type: TABLE DATA; Schema: inventario; Owner: postgres
--

COPY marcas (id, nombre, descripcion, estado, fecha, id_padre) FROM stdin;
1	Sin marca	No tiene marca	A	2017-02-17 09:07:23.375101-05	0
\.


--
-- Name: marcas_id_seq; Type: SEQUENCE SET; Schema: inventario; Owner: postgres
--

SELECT pg_catalog.setval('marcas_id_seq', 1, true);


--
-- Data for Name: modelos; Type: TABLE DATA; Schema: inventario; Owner: postgres
--

COPY modelos (id, nombre, descripcion, estado, fecha, id_padre) FROM stdin;
1	Sin modelo	No posee un modelo	A	2017-02-17 09:07:59.498661-05	0
\.


--
-- Name: modelos_id_seq; Type: SEQUENCE SET; Schema: inventario; Owner: postgres
--

SELECT pg_catalog.setval('modelos_id_seq', 1, true);


--
-- Data for Name: productos; Type: TABLE DATA; Schema: inventario; Owner: postgres
--

COPY productos (id, nombre_corto, vendible, comprable, precio, costo, estado_descriptivo, categoria, garantia, marca, modelo, ubicacion, cantidad, descripcion, codigo_baras, tipo_consumo, bodega) FROM stdin;
\.


--
-- Name: productos_id_seq; Type: SEQUENCE SET; Schema: inventario; Owner: postgres
--

SELECT pg_catalog.setval('productos_id_seq', 1, false);


--
-- Data for Name: productos_impuestos; Type: TABLE DATA; Schema: inventario; Owner: postgres
--

COPY productos_impuestos (id, producto, impuesto) FROM stdin;
\.


--
-- Name: productos_impuestos_id_seq; Type: SEQUENCE SET; Schema: inventario; Owner: postgres
--

SELECT pg_catalog.setval('productos_impuestos_id_seq', 1, false);


--
-- Data for Name: proveedores; Type: TABLE DATA; Schema: inventario; Owner: postgres
--

COPY proveedores (id, nombre, ruc, direccion, id_empresa) FROM stdin;
\.


--
-- Name: proveedores_id_seq; Type: SEQUENCE SET; Schema: inventario; Owner: postgres
--

SELECT pg_catalog.setval('proveedores_id_seq', 1, false);


--
-- Data for Name: tipo_consumo; Type: TABLE DATA; Schema: inventario; Owner: postgres
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
-- Name: tipo_consumo_id_seq; Type: SEQUENCE SET; Schema: inventario; Owner: postgres
--

SELECT pg_catalog.setval('tipo_consumo_id_seq', 7, true);


--
-- Data for Name: tipos_catalogos; Type: TABLE DATA; Schema: inventario; Owner: postgres
--

COPY tipos_catalogos (id, nombre, descripcion, fecha_inicio, fecha_fin, estado, fecha) FROM stdin;
\.


--
-- Name: tipos_catalogos_id_seq; Type: SEQUENCE SET; Schema: inventario; Owner: postgres
--

SELECT pg_catalog.setval('tipos_catalogos_id_seq', 1, false);


--
-- Data for Name: tipos_categorias; Type: TABLE DATA; Schema: inventario; Owner: postgres
--

COPY tipos_categorias (id, nombre, descripcion, estado, fecha) FROM stdin;
1	Sin Tipo Categoria	No posee un tipo de categoria	A	2017-02-17 09:04:46.562617-05
\.


--
-- Name: tipos_categorias_id_seq; Type: SEQUENCE SET; Schema: inventario; Owner: postgres
--

SELECT pg_catalog.setval('tipos_categorias_id_seq', 3, true);


--
-- Data for Name: tipos_garantias; Type: TABLE DATA; Schema: inventario; Owner: postgres
--

COPY tipos_garantias (id, nombre, descripcion, fecha, estado) FROM stdin;
1	Sin tipo Garantitia	No posee un tipo de garantia	2017-02-17 09:05:42.688275-05	\N
\.


--
-- Name: tipos_garantias_id_seq; Type: SEQUENCE SET; Schema: inventario; Owner: postgres
--

SELECT pg_catalog.setval('tipos_garantias_id_seq', 1, true);


--
-- Data for Name: tipos_imagenes_productos; Type: TABLE DATA; Schema: inventario; Owner: postgres
--

COPY tipos_imagenes_productos (id, nombre, estado, fecha) FROM stdin;
\.


--
-- Name: tipos_imagenes_productos_id_seq; Type: SEQUENCE SET; Schema: inventario; Owner: postgres
--

SELECT pg_catalog.setval('tipos_imagenes_productos_id_seq', 1, false);


--
-- Data for Name: tipos_productos; Type: TABLE DATA; Schema: inventario; Owner: postgres
--

COPY tipos_productos (id, nombre, descripcion, estado, fecha) FROM stdin;
\.


--
-- Name: tipos_productos_id_seq; Type: SEQUENCE SET; Schema: inventario; Owner: postgres
--

SELECT pg_catalog.setval('tipos_productos_id_seq', 1, false);


--
-- Data for Name: tipos_tipo_consumo; Type: TABLE DATA; Schema: inventario; Owner: postgres
--

COPY tipos_tipo_consumo (id, nombre, descripcion, estado, fecha) FROM stdin;
\.


--
-- Name: tipos_tipo_consumo_id_seq; Type: SEQUENCE SET; Schema: inventario; Owner: postgres
--

SELECT pg_catalog.setval('tipos_tipo_consumo_id_seq', 1, false);


--
-- Data for Name: ubicaciones; Type: TABLE DATA; Schema: inventario; Owner: postgres
--

COPY ubicaciones (id, nombre, descripcion, id_padre, estado, fecha) FROM stdin;
1	Edificio Matriz	Sucursal Principal de la Empresa	0	A	2017-03-20 10:43:09.411446-05
\.


--
-- Name: ubicaciones_id_seq; Type: SEQUENCE SET; Schema: inventario; Owner: postgres
--

SELECT pg_catalog.setval('ubicaciones_id_seq', 1, true);


SET search_path = public, pg_catalog;

--
-- Data for Name: estados; Type: TABLE DATA; Schema: public; Owner: postgres
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
KPC	Pendiente Cambio	La clave esta pendiente de ser Cambida	2017-12-02
\.


--
-- Data for Name: operadoras_telefonicas; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY operadoras_telefonicas (id, nombre, descripcion, estado, fecha) FROM stdin;
2	MOVISTAR	Operadora Celular	A	16:20:01.92526-05
1	CLARO	Operadora Celular	A	16:19:39.531288-05
3	CNT CELULAR	Operadora Celular	A	16:20:36.933809-05
4	CNT FIJO	Operadora Fijo	A	16:20:58.696937-05
\.


--
-- Name: operadoras_telefonicas_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('operadoras_telefonicas_id_seq', 1, false);


--
-- Data for Name: personas; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY personas (id, primer_nombre, segundo_nombre, primer_apellido, segundo_apellido, id_localidad, calle, transversal, numero) FROM stdin;
1	Consumidor Final	\N	 	\N	1	 	 	 
\.


--
-- Data for Name: personas_correo_electronico; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY personas_correo_electronico (id, id_persona, correo_electronico, estado, fecha) FROM stdin;
\.


--
-- Name: personas_correo_electronico_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('personas_correo_electronico_id_seq', 1, false);


--
-- Data for Name: personas_documentos_identificacion; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY personas_documentos_identificacion (id, id_persona, id_tipo_documento, numero_identificacion, estado, fecha) FROM stdin;
1	1	2	99999999	A	14:42:26.638127-05
\.


--
-- Name: personas_documentos_identificacion_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('personas_documentos_identificacion_id_seq', 1, true);


--
-- Name: personas_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('personas_id_seq', 2, true);


--
-- Data for Name: telefonos_personas; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY telefonos_personas (id, id_persona, numero, fecha, estado, id_operadora_telefonica) FROM stdin;
\.


--
-- Name: telefonos_personas_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('telefonos_personas_id_seq', 1, false);


--
-- Data for Name: tipo_documento_identificacion; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY tipo_documento_identificacion (id, nombre, descripcion, estado, fecha) FROM stdin;
1	CEDULA	Cedula	A	15:51:09.398118-05
2	RUC	Ruc	A	15:51:19.429108-05
3	PASAPORTE	Pasaporte	A	15:51:33.948385-05
\.


--
-- Name: tipo_documento_identificaion_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('tipo_documento_identificaion_id_seq', 1, false);


SET search_path = talento_humano, pg_catalog;

--
-- Data for Name: cargos; Type: TABLE DATA; Schema: talento_humano; Owner: postgres
--

COPY cargos (id, nombre, estado, fecha, id_padre) FROM stdin;
1	Administrador	A	2017-05-18 15:28:06.929823	0
\.


--
-- Name: cargos_id_seq; Type: SEQUENCE SET; Schema: talento_humano; Owner: postgres
--

SELECT pg_catalog.setval('cargos_id_seq', 1, false);


--
-- Data for Name: empleados; Type: TABLE DATA; Schema: talento_humano; Owner: postgres
--

COPY empleados (id, id_persona, estado, fecha, id_usuario, id_cargo) FROM stdin;
\.


--
-- Name: empleados_id_seq; Type: SEQUENCE SET; Schema: talento_humano; Owner: postgres
--

SELECT pg_catalog.setval('empleados_id_seq', 1, true);


--
-- Data for Name: jornadas_de_trabajo; Type: TABLE DATA; Schema: talento_humano; Owner: postgres
--

COPY jornadas_de_trabajo (id, nombre, descripcion, porsentaje_cobro, hora_inicio, hora_fin, hora_descanso) FROM stdin;
\.


--
-- Name: jornadas_de_trabajo_id_seq; Type: SEQUENCE SET; Schema: talento_humano; Owner: postgres
--

SELECT pg_catalog.setval('jornadas_de_trabajo_id_seq', 1, false);


--
-- Data for Name: tipos_contratos; Type: TABLE DATA; Schema: talento_humano; Owner: postgres
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
-- Name: tipos_contratos_id_seq; Type: SEQUENCE SET; Schema: talento_humano; Owner: postgres
--

SELECT pg_catalog.setval('tipos_contratos_id_seq', 8, true);


SET search_path = taller_mecanico, pg_catalog;

--
-- Data for Name: Aseguradora; Type: TABLE DATA; Schema: taller_mecanico; Owner: postgres
--

COPY "Aseguradora" (id, contacto, id_empresa) FROM stdin;
\.


--
-- Name: Aseguradora_id_seq; Type: SEQUENCE SET; Schema: taller_mecanico; Owner: postgres
--

SELECT pg_catalog.setval('"Aseguradora_id_seq"', 1, false);


SET search_path = usuarios, pg_catalog;

--
-- Data for Name: tipo_usuario; Type: TABLE DATA; Schema: usuarios; Owner: postgres
--

COPY tipo_usuario (id, nombre, descripcion, estado, fecha) FROM stdin;
1	ADMIN	Ninguna	A	11:39:13.423733-05
\.


--
-- Name: tipo_usuario_id_seq; Type: SEQUENCE SET; Schema: usuarios; Owner: postgres
--

SELECT pg_catalog.setval('tipo_usuario_id_seq', 1, true);


--
-- Data for Name: usuarios; Type: TABLE DATA; Schema: usuarios; Owner: postgres
--

COPY usuarios (id, nick, clave_clave, id_estado, fecha_creacion, estado_clave, id_tipo_usuario, id_persona, fecha_actualiza, fecha_ultimo_cambio) FROM stdin;
\.


SET search_path = ventas, pg_catalog;

--
-- Data for Name: caja; Type: TABLE DATA; Schema: ventas; Owner: postgres
--

COPY caja (id, nombre, id_sucursal, inicio_numero_factura, numero_fin_factura, estado, fecha) FROM stdin;
\.


--
-- Name: caja_id_seq; Type: SEQUENCE SET; Schema: ventas; Owner: postgres
--

SELECT pg_catalog.setval('caja_id_seq', 1, false);


--
-- Data for Name: caja_usuario; Type: TABLE DATA; Schema: ventas; Owner: postgres
--

COPY caja_usuario (id_caja, id_usuario, id_empleado, estado, fecha) FROM stdin;
\.


--
-- Data for Name: clave_factura; Type: TABLE DATA; Schema: ventas; Owner: postgres
--

COPY clave_factura (id, id_factura, clave_factura, estado, fecha) FROM stdin;
\.


--
-- Name: clave_factura_id_seq; Type: SEQUENCE SET; Schema: ventas; Owner: postgres
--

SELECT pg_catalog.setval('clave_factura_id_seq', 1, false);


--
-- Data for Name: detalle_factura; Type: TABLE DATA; Schema: ventas; Owner: postgres
--

COPY detalle_factura (id, id_factura, id_producto, precio_venta, cantidad, descuento, subtotal_item) FROM stdin;
\.


--
-- Name: detalle_factura_id_seq; Type: SEQUENCE SET; Schema: ventas; Owner: postgres
--

SELECT pg_catalog.setval('detalle_factura_id_seq', 1, false);


--
-- Data for Name: empleado_factura; Type: TABLE DATA; Schema: ventas; Owner: postgres
--

COPY empleado_factura (id_empleado, id_factura, fecha) FROM stdin;
\.


--
-- Data for Name: facturas; Type: TABLE DATA; Schema: ventas; Owner: postgres
--

COPY facturas (id, numero_factura, numero_autorizacion, ruc_emisor, denominacion, direccion_matriz, direccion_sucursal, fecha_autorizacion, fecha_emicion, guia_remision, fecha_caducidad_factura, datos_imprenta, subtotal_iva, subtotal_sin_iva, descuentos, valor_iva, ice, total, estado, id_cliente) FROM stdin;
\.


--
-- Name: facturas_id_seq; Type: SEQUENCE SET; Schema: ventas; Owner: postgres
--

SELECT pg_catalog.setval('facturas_id_seq', 1, false);


--
-- Data for Name: formas_pago; Type: TABLE DATA; Schema: ventas; Owner: postgres
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
-- Data for Name: formas_pago_facturas; Type: TABLE DATA; Schema: ventas; Owner: postgres
--

COPY formas_pago_facturas (id, id_factura, id_formas_pago) FROM stdin;
\.


--
-- Name: formas_pago_facturas_id_seq; Type: SEQUENCE SET; Schema: ventas; Owner: postgres
--

SELECT pg_catalog.setval('formas_pago_facturas_id_seq', 1, false);


--
-- Name: formas_pago_id_seq; Type: SEQUENCE SET; Schema: ventas; Owner: postgres
--

SELECT pg_catalog.setval('formas_pago_id_seq', 14, true);


--
-- Data for Name: producto_descuento; Type: TABLE DATA; Schema: ventas; Owner: postgres
--

COPY producto_descuento (id, id_producto, id_catalogo, estado, fecha_fin_descuento, fecha_inicio_descuento) FROM stdin;
\.


--
-- Name: producto_descuento_id_seq; Type: SEQUENCE SET; Schema: ventas; Owner: postgres
--

SELECT pg_catalog.setval('producto_descuento_id_seq', 1, false);


SET search_path = administracion, pg_catalog;

--
-- Name: actividad_economica_PK; Type: CONSTRAINT; Schema: administracion; Owner: postgres
--

ALTER TABLE ONLY actividad_economica
    ADD CONSTRAINT "actividad_economica_PK" PRIMARY KEY (id);


--
-- Name: clientes_PK; Type: CONSTRAINT; Schema: administracion; Owner: postgres
--

ALTER TABLE ONLY clientes
    ADD CONSTRAINT "clientes_PK" PRIMARY KEY (id, tipo_cliente);


--
-- Name: empresas_PK; Type: CONSTRAINT; Schema: administracion; Owner: postgres
--

ALTER TABLE ONLY empresas
    ADD CONSTRAINT "empresas_PK" PRIMARY KEY (id);


--
-- Name: id_tipo_accion_vista_PK; Type: CONSTRAINT; Schema: administracion; Owner: postgres
--

ALTER TABLE ONLY tipo_accion_vista
    ADD CONSTRAINT "id_tipo_accion_vista_PK" PRIMARY KEY (id);


--
-- Name: imagen_empresa_PK; Type: CONSTRAINT; Schema: administracion; Owner: postgres
--

ALTER TABLE ONLY imagen_empresa
    ADD CONSTRAINT "imagen_empresa_PK" PRIMARY KEY (id);


--
-- Name: info_empre_pk; Type: CONSTRAINT; Schema: administracion; Owner: postgres
--

ALTER TABLE ONLY informacion_empresa_tbl
    ADD CONSTRAINT info_empre_pk PRIMARY KEY (id);


--
-- Name: sucursal_actividad_economica_pk; Type: CONSTRAINT; Schema: administracion; Owner: postgres
--

ALTER TABLE ONLY sucursal_actividad_economica_tbl
    ADD CONSTRAINT sucursal_actividad_economica_pk PRIMARY KEY (id);


--
-- Name: sucursales_pk; Type: CONSTRAINT; Schema: administracion; Owner: postgres
--

ALTER TABLE ONLY sucursales
    ADD CONSTRAINT sucursales_pk PRIMARY KEY (id);


--
-- Name: tipo_bienes_servicios_PK; Type: CONSTRAINT; Schema: administracion; Owner: postgres
--

ALTER TABLE ONLY tipo_bienes_servicios
    ADD CONSTRAINT "tipo_bienes_servicios_PK" PRIMARY KEY (id);


--
-- Name: tipo_empres; Type: CONSTRAINT; Schema: administracion; Owner: postgres
--

ALTER TABLE ONLY tipo_empresa
    ADD CONSTRAINT tipo_empres PRIMARY KEY (id);


--
-- Name: tipo_imagen_producto_PK; Type: CONSTRAINT; Schema: administracion; Owner: postgres
--

ALTER TABLE ONLY tipos_imagenes_empresas
    ADD CONSTRAINT "tipo_imagen_producto_PK" PRIMARY KEY (id);


--
-- Name: usuarios_privilegios_PK; Type: CONSTRAINT; Schema: administracion; Owner: postgres
--

ALTER TABLE ONLY usuarios_privilegios
    ADD CONSTRAINT "usuarios_privilegios_PK" PRIMARY KEY (id);


--
-- Name: valor_unico; Type: CONSTRAINT; Schema: administracion; Owner: postgres
--

ALTER TABLE ONLY empresas
    ADD CONSTRAINT valor_unico UNIQUE (razon_social);


--
-- Name: vistas_PK; Type: CONSTRAINT; Schema: administracion; Owner: postgres
--

ALTER TABLE ONLY vistas
    ADD CONSTRAINT "vistas_PK" PRIMARY KEY (id);


SET search_path = auditoria, pg_catalog;

--
-- Name: auditoria_pk; Type: CONSTRAINT; Schema: auditoria; Owner: postgres
--

ALTER TABLE ONLY auditoria
    ADD CONSTRAINT auditoria_pk PRIMARY KEY (id);


--
-- Name: ingreso_usuarios_PK; Type: CONSTRAINT; Schema: auditoria; Owner: postgres
--

ALTER TABLE ONLY ingresos_usuarios
    ADD CONSTRAINT "ingreso_usuarios_PK" PRIMARY KEY (id);


SET search_path = contabilidad, pg_catalog;

--
-- Name: ambito_impuesto_PK; Type: CONSTRAINT; Schema: contabilidad; Owner: postgres
--

ALTER TABLE ONLY ambitos_impuestos
    ADD CONSTRAINT "ambito_impuesto_PK" PRIMARY KEY (id);


--
-- Name: asiento_contable_PK; Type: CONSTRAINT; Schema: contabilidad; Owner: postgres
--

ALTER TABLE ONLY asientos_contables_diario
    ADD CONSTRAINT "asiento_contable_PK" PRIMARY KEY (id);


--
-- Name: bancos_PK; Type: CONSTRAINT; Schema: contabilidad; Owner: postgres
--

ALTER TABLE ONLY bancos
    ADD CONSTRAINT "bancos_PK" PRIMARY KEY (id);


--
-- Name: cuenta_contable_PK; Type: CONSTRAINT; Schema: contabilidad; Owner: postgres
--

ALTER TABLE ONLY cuentas_contables
    ADD CONSTRAINT "cuenta_contable_PK" PRIMARY KEY (id);


--
-- Name: facturas_pkey; Type: CONSTRAINT; Schema: contabilidad; Owner: postgres
--

ALTER TABLE ONLY repositorio_facturas
    ADD CONSTRAINT facturas_pkey PRIMARY KEY (id_factura);


--
-- Name: facturas_rechazadas_pkey; Type: CONSTRAINT; Schema: contabilidad; Owner: postgres
--

ALTER TABLE ONLY repositorio_facturas_rechazadas
    ADD CONSTRAINT facturas_rechazadas_pkey PRIMARY KEY (id_factura_r);


--
-- Name: fecha_declaracion_impuestos; Type: CONSTRAINT; Schema: contabilidad; Owner: postgres
--

ALTER TABLE ONLY fecha_declaracion_ruc
    ADD CONSTRAINT fecha_declaracion_impuestos PRIMARY KEY (noveno_dig);


--
-- Name: finaciamiento_PK; Type: CONSTRAINT; Schema: contabilidad; Owner: postgres
--

ALTER TABLE ONLY finaciaminto
    ADD CONSTRAINT "finaciamiento_PK" PRIMARY KEY (id);


--
-- Name: gasto_mes_factura; Type: CONSTRAINT; Schema: contabilidad; Owner: postgres
--

ALTER TABLE ONLY gasto_mes_repositorio
    ADD CONSTRAINT gasto_mes_factura PRIMARY KEY (id);


--
-- Name: gastos_impueto_renta_deducion_PK; Type: CONSTRAINT; Schema: contabilidad; Owner: postgres
--

ALTER TABLE ONLY gastos_impuestos_renta_deduccion
    ADD CONSTRAINT "gastos_impueto_renta_deducion_PK" PRIMARY KEY (id);


--
-- Name: gastos_personales_PK; Type: CONSTRAINT; Schema: contabilidad; Owner: postgres
--

ALTER TABLE ONLY tipos_gastos_personales
    ADD CONSTRAINT "gastos_personales_PK" PRIMARY KEY (id);


--
-- Name: grupo_impuesto_PK; Type: CONSTRAINT; Schema: contabilidad; Owner: postgres
--

ALTER TABLE ONLY grupo_impuestos
    ADD CONSTRAINT "grupo_impuesto_PK" PRIMARY KEY (id);


--
-- Name: impuesto_PK; Type: CONSTRAINT; Schema: contabilidad; Owner: postgres
--

ALTER TABLE ONLY impuestos
    ADD CONSTRAINT "impuesto_PK" PRIMARY KEY (id);


--
-- Name: plazos_credito_PK; Type: CONSTRAINT; Schema: contabilidad; Owner: postgres
--

ALTER TABLE ONLY plazos_credito
    ADD CONSTRAINT "plazos_credito_PK" PRIMARY KEY (id);


--
-- Name: repositorio_facturas_correo_PK; Type: CONSTRAINT; Schema: contabilidad; Owner: postgres
--

ALTER TABLE ONLY repositorio_facturas_correo
    ADD CONSTRAINT "repositorio_facturas_correo_PK" PRIMARY KEY (id);


--
-- Name: rol_pagos_PK; Type: CONSTRAINT; Schema: contabilidad; Owner: postgres
--

ALTER TABLE ONLY rol_pagos_empleados
    ADD CONSTRAINT "rol_pagos_PK" PRIMARY KEY (id);


--
-- Name: tipo_cueta_contable; Type: CONSTRAINT; Schema: contabilidad; Owner: postgres
--

ALTER TABLE ONLY tipos_cuentas_contables
    ADD CONSTRAINT tipo_cueta_contable PRIMARY KEY (id);


--
-- Name: tipo_documentos_pkey; Type: CONSTRAINT; Schema: contabilidad; Owner: postgres
--

ALTER TABLE ONLY tipo_documentos
    ADD CONSTRAINT tipo_documentos_pkey PRIMARY KEY (id);


--
-- Name: tipo_impuestos_pkey; Type: CONSTRAINT; Schema: contabilidad; Owner: postgres
--

ALTER TABLE ONLY tipo_impuestos
    ADD CONSTRAINT tipo_impuestos_pkey PRIMARY KEY (id);


SET search_path = inventario, pg_catalog;

--
-- Name: bodega_pro_PK; Type: CONSTRAINT; Schema: inventario; Owner: postgres
--

ALTER TABLE ONLY bodegas
    ADD CONSTRAINT "bodega_pro_PK" PRIMARY KEY (id);


--
-- Name: categorias_PK; Type: CONSTRAINT; Schema: inventario; Owner: postgres
--

ALTER TABLE ONLY categorias
    ADD CONSTRAINT "categorias_PK" PRIMARY KEY (id);


--
-- Name: descripcion_producto_PK; Type: CONSTRAINT; Schema: inventario; Owner: postgres
--

ALTER TABLE ONLY descripcion_producto
    ADD CONSTRAINT "descripcion_producto_PK" PRIMARY KEY (id);


--
-- Name: estado_descriptivo_PK; Type: CONSTRAINT; Schema: inventario; Owner: postgres
--

ALTER TABLE ONLY estado_descriptivo
    ADD CONSTRAINT "estado_descriptivo_PK" PRIMARY KEY (id);


--
-- Name: garantia_PK; Type: CONSTRAINT; Schema: inventario; Owner: postgres
--

ALTER TABLE ONLY garantias
    ADD CONSTRAINT "garantia_PK" PRIMARY KEY (id);


--
-- Name: id; Type: CONSTRAINT; Schema: inventario; Owner: postgres
--

ALTER TABLE ONLY catalogos
    ADD CONSTRAINT id PRIMARY KEY (id);


--
-- Name: imagenes_productos_PK; Type: CONSTRAINT; Schema: inventario; Owner: postgres
--

ALTER TABLE ONLY imagenes_productos
    ADD CONSTRAINT "imagenes_productos_PK" PRIMARY KEY (id);


--
-- Name: manejo_presios_PK; Type: CONSTRAINT; Schema: inventario; Owner: postgres
--

ALTER TABLE ONLY manejo_presios
    ADD CONSTRAINT "manejo_presios_PK" PRIMARY KEY (id);


--
-- Name: marca_PK; Type: CONSTRAINT; Schema: inventario; Owner: postgres
--

ALTER TABLE ONLY marcas
    ADD CONSTRAINT "marca_PK" PRIMARY KEY (id);


--
-- Name: modelos_PK; Type: CONSTRAINT; Schema: inventario; Owner: postgres
--

ALTER TABLE ONLY modelos
    ADD CONSTRAINT "modelos_PK" PRIMARY KEY (id);


--
-- Name: producto_PK; Type: CONSTRAINT; Schema: inventario; Owner: postgres
--

ALTER TABLE ONLY productos
    ADD CONSTRAINT "producto_PK" PRIMARY KEY (id);


--
-- Name: productos_impuestos_PK; Type: CONSTRAINT; Schema: inventario; Owner: postgres
--

ALTER TABLE ONLY productos_impuestos
    ADD CONSTRAINT "productos_impuestos_PK" PRIMARY KEY (id);


--
-- Name: proveedores_PK; Type: CONSTRAINT; Schema: inventario; Owner: postgres
--

ALTER TABLE ONLY proveedores
    ADD CONSTRAINT "proveedores_PK" PRIMARY KEY (id);


--
-- Name: tipo_catalogo_PK; Type: CONSTRAINT; Schema: inventario; Owner: postgres
--

ALTER TABLE ONLY tipos_catalogos
    ADD CONSTRAINT "tipo_catalogo_PK" PRIMARY KEY (id);


--
-- Name: tipo_consumo_pkey; Type: CONSTRAINT; Schema: inventario; Owner: postgres
--

ALTER TABLE ONLY tipo_consumo
    ADD CONSTRAINT tipo_consumo_pkey PRIMARY KEY (id);


--
-- Name: tipo_imagen_producto_PK; Type: CONSTRAINT; Schema: inventario; Owner: postgres
--

ALTER TABLE ONLY tipos_imagenes_productos
    ADD CONSTRAINT "tipo_imagen_producto_PK" PRIMARY KEY (id);


--
-- Name: tipo_pruducto_PK; Type: CONSTRAINT; Schema: inventario; Owner: postgres
--

ALTER TABLE ONLY tipos_productos
    ADD CONSTRAINT "tipo_pruducto_PK" PRIMARY KEY (id);


--
-- Name: tipos_categorias_PK; Type: CONSTRAINT; Schema: inventario; Owner: postgres
--

ALTER TABLE ONLY tipos_categorias
    ADD CONSTRAINT "tipos_categorias_PK" PRIMARY KEY (id);


--
-- Name: tipos_garantia_PK; Type: CONSTRAINT; Schema: inventario; Owner: postgres
--

ALTER TABLE ONLY tipos_garantias
    ADD CONSTRAINT "tipos_garantia_PK" PRIMARY KEY (id);


--
-- Name: tipos_tipo_consumo_PK; Type: CONSTRAINT; Schema: inventario; Owner: postgres
--

ALTER TABLE ONLY tipos_tipo_consumo
    ADD CONSTRAINT "tipos_tipo_consumo_PK" PRIMARY KEY (id);


--
-- Name: ubicacion_PK; Type: CONSTRAINT; Schema: inventario; Owner: postgres
--

ALTER TABLE ONLY ubicaciones
    ADD CONSTRAINT "ubicacion_PK" PRIMARY KEY (id);


SET search_path = public, pg_catalog;

--
-- Name: correo_elctronico_PK; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY personas_correo_electronico
    ADD CONSTRAINT "correo_elctronico_PK" PRIMARY KEY (id);


--
-- Name: documeto_identificacion; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY personas_documentos_identificacion
    ADD CONSTRAINT documeto_identificacion PRIMARY KEY (id_persona, numero_identificacion);


--
-- Name: estado_PK; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY estados
    ADD CONSTRAINT "estado_PK" PRIMARY KEY (id);


--
-- Name: operadoras_telefonicas_PK; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY operadoras_telefonicas
    ADD CONSTRAINT "operadoras_telefonicas_PK" PRIMARY KEY (id);


--
-- Name: persona_PK; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY personas
    ADD CONSTRAINT "persona_PK" PRIMARY KEY (id);


--
-- Name: telefonos_personas_PK; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY telefonos_personas
    ADD CONSTRAINT "telefonos_personas_PK" PRIMARY KEY (id);


--
-- Name: tipo_documento_identificacion_PK; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY tipo_documento_identificacion
    ADD CONSTRAINT "tipo_documento_identificacion_PK" PRIMARY KEY (id);


SET search_path = talento_humano, pg_catalog;

--
-- Name: empleado_PK; Type: CONSTRAINT; Schema: talento_humano; Owner: postgres
--

ALTER TABLE ONLY empleados
    ADD CONSTRAINT "empleado_PK" PRIMARY KEY (id);


--
-- Name: id_cargo_PK; Type: CONSTRAINT; Schema: talento_humano; Owner: postgres
--

ALTER TABLE ONLY cargos
    ADD CONSTRAINT "id_cargo_PK" PRIMARY KEY (id);


--
-- Name: jornada_trabajo_PK; Type: CONSTRAINT; Schema: talento_humano; Owner: postgres
--

ALTER TABLE ONLY jornadas_de_trabajo
    ADD CONSTRAINT "jornada_trabajo_PK" PRIMARY KEY (id);


--
-- Name: tipo_contrato_PK; Type: CONSTRAINT; Schema: talento_humano; Owner: postgres
--

ALTER TABLE ONLY tipos_contratos
    ADD CONSTRAINT "tipo_contrato_PK" PRIMARY KEY (id);


SET search_path = taller_mecanico, pg_catalog;

--
-- Name: Aseguradora_PK; Type: CONSTRAINT; Schema: taller_mecanico; Owner: postgres
--

ALTER TABLE ONLY "Aseguradora"
    ADD CONSTRAINT "Aseguradora_PK" PRIMARY KEY (id);


SET search_path = usuarios, pg_catalog;

--
-- Name: nick_uni; Type: CONSTRAINT; Schema: usuarios; Owner: postgres
--

ALTER TABLE ONLY usuarios
    ADD CONSTRAINT nick_uni UNIQUE (nick);


--
-- Name: tipo_usuario_PK; Type: CONSTRAINT; Schema: usuarios; Owner: postgres
--

ALTER TABLE ONLY tipo_usuario
    ADD CONSTRAINT "tipo_usuario_PK" PRIMARY KEY (id);


--
-- Name: usuarios_PK; Type: CONSTRAINT; Schema: usuarios; Owner: postgres
--

ALTER TABLE ONLY usuarios
    ADD CONSTRAINT "usuarios_PK" PRIMARY KEY (id);


SET search_path = ventas, pg_catalog;

--
-- Name: caja_usuario_PK; Type: CONSTRAINT; Schema: ventas; Owner: postgres
--

ALTER TABLE ONLY caja_usuario
    ADD CONSTRAINT "caja_usuario_PK" PRIMARY KEY (id_caja, id_usuario, id_empleado);


--
-- Name: detalle_factura_pkey; Type: CONSTRAINT; Schema: ventas; Owner: postgres
--

ALTER TABLE ONLY detalle_factura
    ADD CONSTRAINT detalle_factura_pkey PRIMARY KEY (id);


--
-- Name: empleado_factura_PK; Type: CONSTRAINT; Schema: ventas; Owner: postgres
--

ALTER TABLE ONLY empleado_factura
    ADD CONSTRAINT "empleado_factura_PK" PRIMARY KEY (id_empleado, id_factura);


--
-- Name: factura_PK; Type: CONSTRAINT; Schema: ventas; Owner: postgres
--

ALTER TABLE ONLY facturas
    ADD CONSTRAINT "factura_PK" PRIMARY KEY (id);


--
-- Name: formas_pago_facturas_PK; Type: CONSTRAINT; Schema: ventas; Owner: postgres
--

ALTER TABLE ONLY formas_pago_facturas
    ADD CONSTRAINT "formas_pago_facturas_PK" PRIMARY KEY (id);


--
-- Name: formas_pago_pkey; Type: CONSTRAINT; Schema: ventas; Owner: postgres
--

ALTER TABLE ONLY formas_pago
    ADD CONSTRAINT formas_pago_pkey PRIMARY KEY (id);


--
-- Name: id_caja_PK; Type: CONSTRAINT; Schema: ventas; Owner: postgres
--

ALTER TABLE ONLY caja
    ADD CONSTRAINT "id_caja_PK" PRIMARY KEY (id);


--
-- Name: id_clave_factura_PK; Type: CONSTRAINT; Schema: ventas; Owner: postgres
--

ALTER TABLE ONLY clave_factura
    ADD CONSTRAINT "id_clave_factura_PK" PRIMARY KEY (id);


--
-- Name: producto_descuento_PK; Type: CONSTRAINT; Schema: ventas; Owner: postgres
--

ALTER TABLE ONLY producto_descuento
    ADD CONSTRAINT "producto_descuento_PK" PRIMARY KEY (id);


SET search_path = administracion, pg_catalog;

--
-- Name: actividad_economica_tg_audit; Type: TRIGGER; Schema: administracion; Owner: postgres
--

CREATE TRIGGER actividad_economica_tg_audit AFTER INSERT OR DELETE OR UPDATE ON actividad_economica FOR EACH ROW EXECUTE PROCEDURE public.fun_auditoria();


--
-- Name: clientes_tg_audit; Type: TRIGGER; Schema: administracion; Owner: postgres
--

CREATE TRIGGER clientes_tg_audit AFTER INSERT OR DELETE OR UPDATE ON clientes FOR EACH ROW EXECUTE PROCEDURE public.fun_auditoria();


--
-- Name: empresas_tg_audit; Type: TRIGGER; Schema: administracion; Owner: postgres
--

CREATE TRIGGER empresas_tg_audit AFTER INSERT OR DELETE OR UPDATE ON empresas FOR EACH ROW EXECUTE PROCEDURE public.fun_auditoria();


--
-- Name: empresas_tg_audit; Type: TRIGGER; Schema: administracion; Owner: postgres
--

CREATE TRIGGER empresas_tg_audit AFTER INSERT OR DELETE OR UPDATE ON imagen_empresa FOR EACH ROW EXECUTE PROCEDURE public.fun_auditoria();


--
-- Name: empresas_tg_cliente; Type: TRIGGER; Schema: administracion; Owner: postgres
--

CREATE TRIGGER empresas_tg_cliente AFTER INSERT OR DELETE OR UPDATE ON empresas FOR EACH ROW EXECUTE PROCEDURE public.fun_cliente_empresa();


--
-- Name: tipo_accion_vista_tg_audit; Type: TRIGGER; Schema: administracion; Owner: postgres
--

CREATE TRIGGER tipo_accion_vista_tg_audit AFTER INSERT OR DELETE OR UPDATE ON tipo_accion_vista FOR EACH ROW EXECUTE PROCEDURE public.fun_auditoria();


--
-- Name: tipo_bienes_servicios_vista_tg_audit; Type: TRIGGER; Schema: administracion; Owner: postgres
--

CREATE TRIGGER tipo_bienes_servicios_vista_tg_audit AFTER INSERT OR DELETE OR UPDATE ON tipo_bienes_servicios FOR EACH ROW EXECUTE PROCEDURE public.fun_auditoria();


--
-- Name: tipo_empresa_tg_audit; Type: TRIGGER; Schema: administracion; Owner: postgres
--

CREATE TRIGGER tipo_empresa_tg_audit AFTER INSERT OR DELETE OR UPDATE ON tipo_empresa FOR EACH ROW EXECUTE PROCEDURE public.fun_auditoria();


--
-- Name: usuarios_privilegios_tg_audit; Type: TRIGGER; Schema: administracion; Owner: postgres
--

CREATE TRIGGER usuarios_privilegios_tg_audit AFTER INSERT OR DELETE OR UPDATE ON usuarios_privilegios FOR EACH ROW EXECUTE PROCEDURE public.fun_auditoria();


SET search_path = contabilidad, pg_catalog;

--
-- Name: asientos_contables_diario_tg_audit; Type: TRIGGER; Schema: contabilidad; Owner: postgres
--

CREATE TRIGGER asientos_contables_diario_tg_audit AFTER INSERT OR DELETE OR UPDATE ON asientos_contables_diario FOR EACH ROW EXECUTE PROCEDURE public.fun_auditoria();


--
-- Name: bancos_tg_audit; Type: TRIGGER; Schema: contabilidad; Owner: postgres
--

CREATE TRIGGER bancos_tg_audit AFTER INSERT OR DELETE OR UPDATE ON bancos FOR EACH ROW EXECUTE PROCEDURE public.fun_auditoria();


--
-- Name: cuentas_contables_tg_audit; Type: TRIGGER; Schema: contabilidad; Owner: postgres
--

CREATE TRIGGER cuentas_contables_tg_audit AFTER INSERT OR DELETE OR UPDATE ON cuentas_contables FOR EACH ROW EXECUTE PROCEDURE public.fun_auditoria();


--
-- Name: gasto_mes_repositorio_tg_audit; Type: TRIGGER; Schema: contabilidad; Owner: postgres
--

CREATE TRIGGER gasto_mes_repositorio_tg_audit AFTER INSERT OR DELETE OR UPDATE ON gasto_mes_repositorio FOR EACH ROW EXECUTE PROCEDURE public.fun_auditoria();


--
-- Name: gastos_impuestos_renta_deduccion_tg_audit; Type: TRIGGER; Schema: contabilidad; Owner: postgres
--

CREATE TRIGGER gastos_impuestos_renta_deduccion_tg_audit AFTER INSERT OR DELETE OR UPDATE ON gastos_impuestos_renta_deduccion FOR EACH ROW EXECUTE PROCEDURE public.fun_auditoria();


--
-- Name: genealogia_impuestos_tg_audit; Type: TRIGGER; Schema: contabilidad; Owner: postgres
--

CREATE TRIGGER genealogia_impuestos_tg_audit AFTER INSERT OR DELETE OR UPDATE ON genealogia_impuestos FOR EACH ROW EXECUTE PROCEDURE public.fun_auditoria();


--
-- Name: personas_tg_audit; Type: TRIGGER; Schema: contabilidad; Owner: postgres
--

CREATE TRIGGER personas_tg_audit AFTER INSERT OR DELETE OR UPDATE ON ambitos_impuestos FOR EACH ROW EXECUTE PROCEDURE public.fun_auditoria();


--
-- Name: personas_tg_audit; Type: TRIGGER; Schema: contabilidad; Owner: postgres
--

CREATE TRIGGER personas_tg_audit AFTER INSERT OR DELETE OR UPDATE ON grupo_impuestos FOR EACH ROW EXECUTE PROCEDURE public.fun_auditoria();


--
-- Name: personas_tg_audit; Type: TRIGGER; Schema: contabilidad; Owner: postgres
--

CREATE TRIGGER personas_tg_audit AFTER INSERT OR DELETE OR UPDATE ON impuestos FOR EACH ROW EXECUTE PROCEDURE public.fun_auditoria();


--
-- Name: tipo_documentos_tg_audit; Type: TRIGGER; Schema: contabilidad; Owner: postgres
--

CREATE TRIGGER tipo_documentos_tg_audit AFTER INSERT OR DELETE OR UPDATE ON tipo_documentos FOR EACH ROW EXECUTE PROCEDURE public.fun_auditoria();


--
-- Name: tipo_impuestos_tg_audit; Type: TRIGGER; Schema: contabilidad; Owner: postgres
--

CREATE TRIGGER tipo_impuestos_tg_audit AFTER INSERT OR DELETE OR UPDATE ON tipo_impuestos FOR EACH ROW EXECUTE PROCEDURE public.fun_auditoria();


--
-- Name: tipos_cuentas_contables_tg_audit; Type: TRIGGER; Schema: contabilidad; Owner: postgres
--

CREATE TRIGGER tipos_cuentas_contables_tg_audit AFTER INSERT OR DELETE OR UPDATE ON tipos_cuentas_contables FOR EACH ROW EXECUTE PROCEDURE public.fun_auditoria();


--
-- Name: tipos_gastos_personales_tg_audit; Type: TRIGGER; Schema: contabilidad; Owner: postgres
--

CREATE TRIGGER tipos_gastos_personales_tg_audit AFTER INSERT OR DELETE OR UPDATE ON tipos_gastos_personales FOR EACH ROW EXECUTE PROCEDURE public.fun_auditoria();


SET search_path = inventario, pg_catalog;

--
-- Name: bodegas_tg_audit; Type: TRIGGER; Schema: inventario; Owner: postgres
--

CREATE TRIGGER bodegas_tg_audit AFTER INSERT OR DELETE OR UPDATE ON bodegas FOR EACH ROW EXECUTE PROCEDURE public.fun_auditoria();


--
-- Name: personas_tg_audit; Type: TRIGGER; Schema: inventario; Owner: postgres
--

CREATE TRIGGER personas_tg_audit AFTER INSERT OR DELETE OR UPDATE ON categorias FOR EACH ROW EXECUTE PROCEDURE public.fun_auditoria();


--
-- Name: personas_tg_audit; Type: TRIGGER; Schema: inventario; Owner: postgres
--

CREATE TRIGGER personas_tg_audit AFTER INSERT OR DELETE OR UPDATE ON descripcion_producto FOR EACH ROW EXECUTE PROCEDURE public.fun_auditoria();


--
-- Name: personas_tg_audit; Type: TRIGGER; Schema: inventario; Owner: postgres
--

CREATE TRIGGER personas_tg_audit AFTER INSERT OR DELETE OR UPDATE ON estado_descriptivo FOR EACH ROW EXECUTE PROCEDURE public.fun_auditoria();


--
-- Name: personas_tg_audit; Type: TRIGGER; Schema: inventario; Owner: postgres
--

CREATE TRIGGER personas_tg_audit AFTER INSERT OR DELETE OR UPDATE ON garantias FOR EACH ROW EXECUTE PROCEDURE public.fun_auditoria();


--
-- Name: personas_tg_audit; Type: TRIGGER; Schema: inventario; Owner: postgres
--

CREATE TRIGGER personas_tg_audit AFTER INSERT OR DELETE OR UPDATE ON imagenes_productos FOR EACH ROW EXECUTE PROCEDURE public.fun_auditoria();


--
-- Name: personas_tg_audit; Type: TRIGGER; Schema: inventario; Owner: postgres
--

CREATE TRIGGER personas_tg_audit AFTER INSERT OR DELETE OR UPDATE ON marcas FOR EACH ROW EXECUTE PROCEDURE public.fun_auditoria();


--
-- Name: personas_tg_audit; Type: TRIGGER; Schema: inventario; Owner: postgres
--

CREATE TRIGGER personas_tg_audit AFTER INSERT OR DELETE OR UPDATE ON modelos FOR EACH ROW EXECUTE PROCEDURE public.fun_auditoria();


--
-- Name: personas_tg_audit; Type: TRIGGER; Schema: inventario; Owner: postgres
--

CREATE TRIGGER personas_tg_audit AFTER INSERT OR DELETE OR UPDATE ON proveedores FOR EACH ROW EXECUTE PROCEDURE public.fun_auditoria();


--
-- Name: personas_tg_audit; Type: TRIGGER; Schema: inventario; Owner: postgres
--

CREATE TRIGGER personas_tg_audit AFTER INSERT OR DELETE OR UPDATE ON tipos_categorias FOR EACH ROW EXECUTE PROCEDURE public.fun_auditoria();


--
-- Name: personas_tg_audit; Type: TRIGGER; Schema: inventario; Owner: postgres
--

CREATE TRIGGER personas_tg_audit AFTER INSERT OR DELETE OR UPDATE ON tipos_garantias FOR EACH ROW EXECUTE PROCEDURE public.fun_auditoria();


--
-- Name: personas_tg_audit; Type: TRIGGER; Schema: inventario; Owner: postgres
--

CREATE TRIGGER personas_tg_audit AFTER INSERT OR DELETE OR UPDATE ON tipos_imagenes_productos FOR EACH ROW EXECUTE PROCEDURE public.fun_auditoria();


--
-- Name: personas_tg_audit; Type: TRIGGER; Schema: inventario; Owner: postgres
--

CREATE TRIGGER personas_tg_audit AFTER INSERT OR DELETE OR UPDATE ON tipos_productos FOR EACH ROW EXECUTE PROCEDURE public.fun_auditoria();


--
-- Name: personas_tg_audit; Type: TRIGGER; Schema: inventario; Owner: postgres
--

CREATE TRIGGER personas_tg_audit AFTER INSERT OR DELETE OR UPDATE ON tipos_catalogos FOR EACH ROW EXECUTE PROCEDURE public.fun_auditoria();


--
-- Name: personas_tg_audit; Type: TRIGGER; Schema: inventario; Owner: postgres
--

CREATE TRIGGER personas_tg_audit AFTER INSERT OR DELETE OR UPDATE ON catalogos FOR EACH ROW EXECUTE PROCEDURE public.fun_auditoria();


--
-- Name: productos_impuestos_tg_audit; Type: TRIGGER; Schema: inventario; Owner: postgres
--

CREATE TRIGGER productos_impuestos_tg_audit AFTER INSERT OR DELETE OR UPDATE ON productos_impuestos FOR EACH ROW EXECUTE PROCEDURE public.fun_auditoria();


--
-- Name: productos_tg_audit; Type: TRIGGER; Schema: inventario; Owner: postgres
--

CREATE TRIGGER productos_tg_audit AFTER INSERT OR DELETE OR UPDATE ON productos FOR EACH ROW EXECUTE PROCEDURE public.fun_auditoria();


--
-- Name: tipo_consumo_tg_audit; Type: TRIGGER; Schema: inventario; Owner: postgres
--

CREATE TRIGGER tipo_consumo_tg_audit AFTER INSERT OR DELETE OR UPDATE ON tipo_consumo FOR EACH ROW EXECUTE PROCEDURE public.fun_auditoria();


--
-- Name: tipos_catalogos_tg_audit; Type: TRIGGER; Schema: inventario; Owner: postgres
--

CREATE TRIGGER tipos_catalogos_tg_audit AFTER INSERT OR DELETE OR UPDATE ON tipos_catalogos FOR EACH ROW EXECUTE PROCEDURE public.fun_auditoria();


--
-- Name: tipos_tipo_consumo_tg_audit; Type: TRIGGER; Schema: inventario; Owner: postgres
--

CREATE TRIGGER tipos_tipo_consumo_tg_audit AFTER INSERT OR DELETE OR UPDATE ON tipos_tipo_consumo FOR EACH ROW EXECUTE PROCEDURE public.fun_auditoria();


--
-- Name: ubicaciones_tg_audit; Type: TRIGGER; Schema: inventario; Owner: postgres
--

CREATE TRIGGER ubicaciones_tg_audit AFTER INSERT OR DELETE OR UPDATE ON ubicaciones FOR EACH ROW EXECUTE PROCEDURE public.fun_auditoria();


SET search_path = public, pg_catalog;

--
-- Name: estados_tg_audit; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER estados_tg_audit AFTER INSERT OR DELETE OR UPDATE ON estados FOR EACH ROW EXECUTE PROCEDURE fun_auditoria();


--
-- Name: inserta_cliente_tg_usuario; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER inserta_cliente_tg_usuario AFTER INSERT OR DELETE OR UPDATE ON personas_documentos_identificacion FOR EACH ROW EXECUTE PROCEDURE fun_cliente_persona();


--
-- Name: operadoras_telefonicas_tg_audit; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER operadoras_telefonicas_tg_audit AFTER INSERT OR DELETE OR UPDATE ON operadoras_telefonicas FOR EACH ROW EXECUTE PROCEDURE fun_auditoria();


--
-- Name: personas_correo_electronico_tg_audit; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER personas_correo_electronico_tg_audit AFTER INSERT OR DELETE OR UPDATE ON personas_correo_electronico FOR EACH ROW EXECUTE PROCEDURE fun_auditoria();


--
-- Name: personas_documentos_identificacion_tg_audit; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER personas_documentos_identificacion_tg_audit AFTER INSERT OR DELETE OR UPDATE ON personas_documentos_identificacion FOR EACH ROW EXECUTE PROCEDURE fun_auditoria();


--
-- Name: personas_tg_audit; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER personas_tg_audit AFTER INSERT OR DELETE OR UPDATE ON personas FOR EACH ROW EXECUTE PROCEDURE fun_auditoria();


--
-- Name: telefonos_personas_tg_audit; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER telefonos_personas_tg_audit AFTER INSERT OR DELETE OR UPDATE ON telefonos_personas FOR EACH ROW EXECUTE PROCEDURE fun_auditoria();


--
-- Name: tipo_documento_identificacion_tg_audit; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER tipo_documento_identificacion_tg_audit AFTER INSERT OR DELETE OR UPDATE ON tipo_documento_identificacion FOR EACH ROW EXECUTE PROCEDURE fun_auditoria();


SET search_path = talento_humano, pg_catalog;

--
-- Name: cargos_tg_audit; Type: TRIGGER; Schema: talento_humano; Owner: postgres
--

CREATE TRIGGER cargos_tg_audit AFTER INSERT OR DELETE OR UPDATE ON cargos FOR EACH ROW EXECUTE PROCEDURE public.fun_auditoria();


--
-- Name: empleados_tg_audit; Type: TRIGGER; Schema: talento_humano; Owner: postgres
--

CREATE TRIGGER empleados_tg_audit AFTER INSERT OR DELETE OR UPDATE ON empleados FOR EACH ROW EXECUTE PROCEDURE public.fun_auditoria();


--
-- Name: jornadas_de_trabajo_tg_audit; Type: TRIGGER; Schema: talento_humano; Owner: postgres
--

CREATE TRIGGER jornadas_de_trabajo_tg_audit AFTER INSERT OR DELETE OR UPDATE ON jornadas_de_trabajo FOR EACH ROW EXECUTE PROCEDURE public.fun_auditoria();


--
-- Name: tipo_usuario_tg_audit; Type: TRIGGER; Schema: talento_humano; Owner: postgres
--

CREATE TRIGGER tipo_usuario_tg_audit AFTER INSERT OR DELETE OR UPDATE ON tipos_contratos FOR EACH ROW EXECUTE PROCEDURE public.fun_auditoria();


--
-- Name: tipos_contratos_tg_audit; Type: TRIGGER; Schema: talento_humano; Owner: postgres
--

CREATE TRIGGER tipos_contratos_tg_audit AFTER INSERT OR DELETE OR UPDATE ON tipos_contratos FOR EACH ROW EXECUTE PROCEDURE public.fun_auditoria();


SET search_path = usuarios, pg_catalog;

--
-- Name: tipo_usuario_tg_audit; Type: TRIGGER; Schema: usuarios; Owner: postgres
--

CREATE TRIGGER tipo_usuario_tg_audit AFTER INSERT OR DELETE OR UPDATE ON tipo_usuario FOR EACH ROW EXECUTE PROCEDURE public.fun_auditoria();


--
-- Name: usuarios_tg_audit; Type: TRIGGER; Schema: usuarios; Owner: postgres
--

CREATE TRIGGER usuarios_tg_audit AFTER INSERT OR DELETE OR UPDATE ON usuarios FOR EACH ROW EXECUTE PROCEDURE public.fun_auditoria();


SET search_path = ventas, pg_catalog;

--
-- Name: caja_tg_audit; Type: TRIGGER; Schema: ventas; Owner: postgres
--

CREATE TRIGGER caja_tg_audit AFTER INSERT OR DELETE OR UPDATE ON caja FOR EACH ROW EXECUTE PROCEDURE public.fun_auditoria();


--
-- Name: caja_usuario_tg_audit; Type: TRIGGER; Schema: ventas; Owner: postgres
--

CREATE TRIGGER caja_usuario_tg_audit AFTER INSERT OR DELETE OR UPDATE ON caja_usuario FOR EACH ROW EXECUTE PROCEDURE public.fun_auditoria();


--
-- Name: clave_factura_tg_audit; Type: TRIGGER; Schema: ventas; Owner: postgres
--

CREATE TRIGGER clave_factura_tg_audit AFTER INSERT OR DELETE OR UPDATE ON clave_factura FOR EACH ROW EXECUTE PROCEDURE public.fun_auditoria();


--
-- Name: detalle_factura_tg_audit; Type: TRIGGER; Schema: ventas; Owner: postgres
--

CREATE TRIGGER detalle_factura_tg_audit AFTER INSERT OR DELETE OR UPDATE ON detalle_factura FOR EACH ROW EXECUTE PROCEDURE public.fun_auditoria();


--
-- Name: empleado_factura_tg_audit; Type: TRIGGER; Schema: ventas; Owner: postgres
--

CREATE TRIGGER empleado_factura_tg_audit AFTER INSERT OR DELETE OR UPDATE ON empleado_factura FOR EACH ROW EXECUTE PROCEDURE public.fun_auditoria();


--
-- Name: facturas_tg_audit; Type: TRIGGER; Schema: ventas; Owner: postgres
--

CREATE TRIGGER facturas_tg_audit AFTER INSERT OR DELETE OR UPDATE ON facturas FOR EACH ROW EXECUTE PROCEDURE public.fun_auditoria();


--
-- Name: formas_pago_facturas_tg_audit; Type: TRIGGER; Schema: ventas; Owner: postgres
--

CREATE TRIGGER formas_pago_facturas_tg_audit AFTER INSERT OR DELETE OR UPDATE ON formas_pago_facturas FOR EACH ROW EXECUTE PROCEDURE public.fun_auditoria();


--
-- Name: formas_pago_tg_audit; Type: TRIGGER; Schema: ventas; Owner: postgres
--

CREATE TRIGGER formas_pago_tg_audit AFTER INSERT OR DELETE OR UPDATE ON formas_pago FOR EACH ROW EXECUTE PROCEDURE public.fun_auditoria();


--
-- Name: producto_descuento_tg_audit; Type: TRIGGER; Schema: ventas; Owner: postgres
--

CREATE TRIGGER producto_descuento_tg_audit AFTER INSERT OR DELETE OR UPDATE ON producto_descuento FOR EACH ROW EXECUTE PROCEDURE public.fun_auditoria();


SET search_path = administracion, pg_catalog;

--
-- Name: estado; Type: FK CONSTRAINT; Schema: administracion; Owner: postgres
--

ALTER TABLE ONLY tipo_empresa
    ADD CONSTRAINT estado FOREIGN KEY (estado) REFERENCES public.estados(id);


--
-- Name: estado; Type: FK CONSTRAINT; Schema: administracion; Owner: postgres
--

ALTER TABLE ONLY clientes
    ADD CONSTRAINT estado FOREIGN KEY (estado) REFERENCES public.estados(id);


--
-- Name: estado_FK; Type: FK CONSTRAINT; Schema: administracion; Owner: postgres
--

ALTER TABLE ONLY tipo_bienes_servicios
    ADD CONSTRAINT "estado_FK" FOREIGN KEY (estado) REFERENCES public.estados(id);


--
-- Name: estado_FK; Type: FK CONSTRAINT; Schema: administracion; Owner: postgres
--

ALTER TABLE ONLY actividad_economica
    ADD CONSTRAINT "estado_FK" FOREIGN KEY (estado) REFERENCES public.estados(id);


--
-- Name: estado_FK; Type: FK CONSTRAINT; Schema: administracion; Owner: postgres
--

ALTER TABLE ONLY usuarios_privilegios
    ADD CONSTRAINT "estado_FK" FOREIGN KEY (estado) REFERENCES public.estados(id);


--
-- Name: estado_FK; Type: FK CONSTRAINT; Schema: administracion; Owner: postgres
--

ALTER TABLE ONLY tipos_imagenes_empresas
    ADD CONSTRAINT "estado_FK" FOREIGN KEY (estado) REFERENCES public.estados(id);


--
-- Name: estado_empresa_FK; Type: FK CONSTRAINT; Schema: administracion; Owner: postgres
--

ALTER TABLE ONLY empresas
    ADD CONSTRAINT "estado_empresa_FK" FOREIGN KEY (id_estado) REFERENCES public.estados(id);


--
-- Name: estado_sucursal_actividad_economica_fk; Type: FK CONSTRAINT; Schema: administracion; Owner: postgres
--

ALTER TABLE ONLY sucursal_actividad_economica_tbl
    ADD CONSTRAINT estado_sucursal_actividad_economica_fk FOREIGN KEY (estado) REFERENCES public.estados(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: id_actividad_economica_fk; Type: FK CONSTRAINT; Schema: administracion; Owner: postgres
--

ALTER TABLE ONLY sucursal_actividad_economica_tbl
    ADD CONSTRAINT id_actividad_economica_fk FOREIGN KEY (id_actividad_economica) REFERENCES actividad_economica(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: id_empresa_fq; Type: FK CONSTRAINT; Schema: administracion; Owner: postgres
--

ALTER TABLE ONLY informacion_empresa_tbl
    ADD CONSTRAINT id_empresa_fq FOREIGN KEY (id_empresa) REFERENCES imagen_empresa(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: id_sucursal_fk; Type: FK CONSTRAINT; Schema: administracion; Owner: postgres
--

ALTER TABLE ONLY informacion_empresa_tbl
    ADD CONSTRAINT id_sucursal_fk FOREIGN KEY (id_sucursal) REFERENCES sucursales(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: id_sucursal_fk; Type: FK CONSTRAINT; Schema: administracion; Owner: postgres
--

ALTER TABLE ONLY sucursal_actividad_economica_tbl
    ADD CONSTRAINT id_sucursal_fk FOREIGN KEY (id_sucursal) REFERENCES sucursales(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: id_tipo_empresa_fk; Type: FK CONSTRAINT; Schema: administracion; Owner: postgres
--

ALTER TABLE ONLY informacion_empresa_tbl
    ADD CONSTRAINT id_tipo_empresa_fk FOREIGN KEY (id_tipo_empresa) REFERENCES tipo_empresa(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: imagen_empresa_estado_FK; Type: FK CONSTRAINT; Schema: administracion; Owner: postgres
--

ALTER TABLE ONLY imagen_empresa
    ADD CONSTRAINT "imagen_empresa_estado_FK" FOREIGN KEY (estado) REFERENCES public.estados(id);


--
-- Name: tipo_bienes_servicios_FK; Type: FK CONSTRAINT; Schema: administracion; Owner: postgres
--

ALTER TABLE ONLY actividad_economica
    ADD CONSTRAINT "tipo_bienes_servicios_FK" FOREIGN KEY (id_tipo_bienes_servicios) REFERENCES tipo_bienes_servicios(id);


--
-- Name: tipo_imagen_empresa_FK; Type: FK CONSTRAINT; Schema: administracion; Owner: postgres
--

ALTER TABLE ONLY imagen_empresa
    ADD CONSTRAINT "tipo_imagen_empresa_FK" FOREIGN KEY (tipo_imagen) REFERENCES tipos_imagenes_empresas(id);


--
-- Name: usuario_privilegios_tipo_accion_vista_FK; Type: FK CONSTRAINT; Schema: administracion; Owner: postgres
--

ALTER TABLE ONLY usuarios_privilegios
    ADD CONSTRAINT "usuario_privilegios_tipo_accion_vista_FK" FOREIGN KEY (id_tipo_accion_vistas) REFERENCES tipo_accion_vista(id);


--
-- Name: usuario_privilegios_tipo_usuario_FK; Type: FK CONSTRAINT; Schema: administracion; Owner: postgres
--

ALTER TABLE ONLY usuarios_privilegios
    ADD CONSTRAINT "usuario_privilegios_tipo_usuario_FK" FOREIGN KEY (id_tipo_usuario) REFERENCES usuarios.tipo_usuario(id);


SET search_path = contabilidad, pg_catalog;

--
-- Name: ambito_FK; Type: FK CONSTRAINT; Schema: contabilidad; Owner: postgres
--

ALTER TABLE ONLY impuestos
    ADD CONSTRAINT "ambito_FK" FOREIGN KEY (ambito) REFERENCES ambitos_impuestos(id);


--
-- Name: estado_FK; Type: FK CONSTRAINT; Schema: contabilidad; Owner: postgres
--

ALTER TABLE ONLY grupo_impuestos
    ADD CONSTRAINT "estado_FK" FOREIGN KEY (estado) REFERENCES public.estados(id);


--
-- Name: estado_FK; Type: FK CONSTRAINT; Schema: contabilidad; Owner: postgres
--

ALTER TABLE ONLY ambitos_impuestos
    ADD CONSTRAINT "estado_FK" FOREIGN KEY (estado) REFERENCES public.estados(id);


--
-- Name: estado_FK; Type: FK CONSTRAINT; Schema: contabilidad; Owner: postgres
--

ALTER TABLE ONLY impuestos
    ADD CONSTRAINT "estado_FK" FOREIGN KEY (estado) REFERENCES public.estados(id);


--
-- Name: estado_asiento_contable_FK; Type: FK CONSTRAINT; Schema: contabilidad; Owner: postgres
--

ALTER TABLE ONLY asientos_contables_diario
    ADD CONSTRAINT "estado_asiento_contable_FK" FOREIGN KEY (estado) REFERENCES public.estados(id);


--
-- Name: estado_bancos_FK; Type: FK CONSTRAINT; Schema: contabilidad; Owner: postgres
--

ALTER TABLE ONLY bancos
    ADD CONSTRAINT "estado_bancos_FK" FOREIGN KEY (estado) REFERENCES public.estados(id);


--
-- Name: estado_factura; Type: FK CONSTRAINT; Schema: contabilidad; Owner: postgres
--

ALTER TABLE ONLY repositorio_facturas
    ADD CONSTRAINT estado_factura FOREIGN KEY (estado) REFERENCES public.estados(id);


--
-- Name: estado_pago; Type: FK CONSTRAINT; Schema: contabilidad; Owner: postgres
--

ALTER TABLE ONLY finaciaminto
    ADD CONSTRAINT estado_pago FOREIGN KEY (estado_pago) REFERENCES public.estados(id);


--
-- Name: estado_tipo_cuenta_contable_FK; Type: FK CONSTRAINT; Schema: contabilidad; Owner: postgres
--

ALTER TABLE ONLY tipos_cuentas_contables
    ADD CONSTRAINT "estado_tipo_cuenta_contable_FK" FOREIGN KEY (estado) REFERENCES public.estados(id);


--
-- Name: estado_tipo_documento_FK; Type: FK CONSTRAINT; Schema: contabilidad; Owner: postgres
--

ALTER TABLE ONLY tipo_documentos
    ADD CONSTRAINT "estado_tipo_documento_FK" FOREIGN KEY (estado) REFERENCES public.estados(id);


--
-- Name: estado_tipo_impuesto_FK; Type: FK CONSTRAINT; Schema: contabilidad; Owner: postgres
--

ALTER TABLE ONLY tipo_impuestos
    ADD CONSTRAINT "estado_tipo_impuesto_FK" FOREIGN KEY (estado) REFERENCES public.estados(id);


--
-- Name: estado_ver_factura; Type: FK CONSTRAINT; Schema: contabilidad; Owner: postgres
--

ALTER TABLE ONLY repositorio_facturas
    ADD CONSTRAINT estado_ver_factura FOREIGN KEY (estado_view) REFERENCES public.estados(id);


--
-- Name: factura_finaciamiento_FK; Type: FK CONSTRAINT; Schema: contabilidad; Owner: postgres
--

ALTER TABLE ONLY finaciaminto
    ADD CONSTRAINT "factura_finaciamiento_FK" FOREIGN KEY (id_factura) REFERENCES ventas.facturas(id);


--
-- Name: gastos_impueto_renta_deducion_estado; Type: FK CONSTRAINT; Schema: contabilidad; Owner: postgres
--

ALTER TABLE ONLY gastos_impuestos_renta_deduccion
    ADD CONSTRAINT gastos_impueto_renta_deducion_estado FOREIGN KEY (estado) REFERENCES public.estados(id);


--
-- Name: gastos_impueto_renta_deducion_factura; Type: FK CONSTRAINT; Schema: contabilidad; Owner: postgres
--

ALTER TABLE ONLY gastos_impuestos_renta_deduccion
    ADD CONSTRAINT gastos_impueto_renta_deducion_factura FOREIGN KEY (id_factura) REFERENCES repositorio_facturas(id_factura);


--
-- Name: id_empleasdo_FK; Type: FK CONSTRAINT; Schema: contabilidad; Owner: postgres
--

ALTER TABLE ONLY rol_pagos_empleados
    ADD CONSTRAINT "id_empleasdo_FK" FOREIGN KEY (id_empleado) REFERENCES talento_humano.empleados(id);


--
-- Name: persona_bancos_FK; Type: FK CONSTRAINT; Schema: contabilidad; Owner: postgres
--

ALTER TABLE ONLY bancos
    ADD CONSTRAINT "persona_bancos_FK" FOREIGN KEY (titular_cuenta) REFERENCES public.personas(id);


--
-- Name: plazos_credito_FK; Type: FK CONSTRAINT; Schema: contabilidad; Owner: postgres
--

ALTER TABLE ONLY finaciaminto
    ADD CONSTRAINT "plazos_credito_FK" FOREIGN KEY (id_plazos_credito) REFERENCES plazos_credito(id);


--
-- Name: repositorio_facturas_rechazadas_estado_fkey; Type: FK CONSTRAINT; Schema: contabilidad; Owner: postgres
--

ALTER TABLE ONLY repositorio_facturas_rechazadas
    ADD CONSTRAINT repositorio_facturas_rechazadas_estado_fkey FOREIGN KEY (estado) REFERENCES public.estados(id);


--
-- Name: tipo_cuenta_cuentas_contables_FK; Type: FK CONSTRAINT; Schema: contabilidad; Owner: postgres
--

ALTER TABLE ONLY cuentas_contables
    ADD CONSTRAINT "tipo_cuenta_cuentas_contables_FK" FOREIGN KEY (tipo_cuenta) REFERENCES tipos_cuentas_contables(id);


--
-- Name: tipo_impuesto; Type: FK CONSTRAINT; Schema: contabilidad; Owner: postgres
--

ALTER TABLE ONLY impuestos
    ADD CONSTRAINT tipo_impuesto FOREIGN KEY (tipo_impuesto) REFERENCES tipo_impuestos(id);


SET search_path = inventario, pg_catalog;

--
-- Name: bodega_FK; Type: FK CONSTRAINT; Schema: inventario; Owner: postgres
--

ALTER TABLE ONLY productos
    ADD CONSTRAINT "bodega_FK" FOREIGN KEY (bodega) REFERENCES bodegas(id);


--
-- Name: categoria_FK; Type: FK CONSTRAINT; Schema: inventario; Owner: postgres
--

ALTER TABLE ONLY productos
    ADD CONSTRAINT "categoria_FK" FOREIGN KEY (categoria) REFERENCES categorias(id);


--
-- Name: estado_FK; Type: FK CONSTRAINT; Schema: inventario; Owner: postgres
--

ALTER TABLE ONLY tipos_imagenes_productos
    ADD CONSTRAINT "estado_FK" FOREIGN KEY (estado) REFERENCES public.estados(id);


--
-- Name: estado_FK; Type: FK CONSTRAINT; Schema: inventario; Owner: postgres
--

ALTER TABLE ONLY imagenes_productos
    ADD CONSTRAINT "estado_FK" FOREIGN KEY (estado) REFERENCES public.estados(id);


--
-- Name: estado_FK; Type: FK CONSTRAINT; Schema: inventario; Owner: postgres
--

ALTER TABLE ONLY garantias
    ADD CONSTRAINT "estado_FK" FOREIGN KEY (estado) REFERENCES public.estados(id);


--
-- Name: estado_FK; Type: FK CONSTRAINT; Schema: inventario; Owner: postgres
--

ALTER TABLE ONLY tipos_categorias
    ADD CONSTRAINT "estado_FK" FOREIGN KEY (estado) REFERENCES public.estados(id);


--
-- Name: estado_FK; Type: FK CONSTRAINT; Schema: inventario; Owner: postgres
--

ALTER TABLE ONLY marcas
    ADD CONSTRAINT "estado_FK" FOREIGN KEY (estado) REFERENCES public.estados(id);


--
-- Name: estado_FK; Type: FK CONSTRAINT; Schema: inventario; Owner: postgres
--

ALTER TABLE ONLY modelos
    ADD CONSTRAINT "estado_FK" FOREIGN KEY (estado) REFERENCES public.estados(id);


--
-- Name: estado_FK; Type: FK CONSTRAINT; Schema: inventario; Owner: postgres
--

ALTER TABLE ONLY estado_descriptivo
    ADD CONSTRAINT "estado_FK" FOREIGN KEY (estado) REFERENCES public.estados(id);


--
-- Name: estado_FK; Type: FK CONSTRAINT; Schema: inventario; Owner: postgres
--

ALTER TABLE ONLY tipos_productos
    ADD CONSTRAINT "estado_FK" FOREIGN KEY (estado) REFERENCES public.estados(id);


--
-- Name: estado_FK; Type: FK CONSTRAINT; Schema: inventario; Owner: postgres
--

ALTER TABLE ONLY tipos_catalogos
    ADD CONSTRAINT "estado_FK" FOREIGN KEY (estado) REFERENCES public.estados(id);


--
-- Name: estado_FK; Type: FK CONSTRAINT; Schema: inventario; Owner: postgres
--

ALTER TABLE ONLY tipos_tipo_consumo
    ADD CONSTRAINT "estado_FK" FOREIGN KEY (estado) REFERENCES public.estados(id);


--
-- Name: estado_FK; Type: FK CONSTRAINT; Schema: inventario; Owner: postgres
--

ALTER TABLE ONLY ubicaciones
    ADD CONSTRAINT "estado_FK" FOREIGN KEY (estado) REFERENCES public.estados(id);


--
-- Name: estado_FK; Type: FK CONSTRAINT; Schema: inventario; Owner: postgres
--

ALTER TABLE ONLY manejo_presios
    ADD CONSTRAINT "estado_FK" FOREIGN KEY (estado) REFERENCES public.estados(id);


--
-- Name: estado_bodega_FK; Type: FK CONSTRAINT; Schema: inventario; Owner: postgres
--

ALTER TABLE ONLY bodegas
    ADD CONSTRAINT "estado_bodega_FK" FOREIGN KEY (estado) REFERENCES public.estados(id);


--
-- Name: estado_descriptivo_FK; Type: FK CONSTRAINT; Schema: inventario; Owner: postgres
--

ALTER TABLE ONLY productos
    ADD CONSTRAINT "estado_descriptivo_FK" FOREIGN KEY (estado_descriptivo) REFERENCES estado_descriptivo(id);


--
-- Name: estados; Type: FK CONSTRAINT; Schema: inventario; Owner: postgres
--

ALTER TABLE ONLY tipos_garantias
    ADD CONSTRAINT estados FOREIGN KEY (estado) REFERENCES public.estados(id);


--
-- Name: garantia_FK; Type: FK CONSTRAINT; Schema: inventario; Owner: postgres
--

ALTER TABLE ONLY productos
    ADD CONSTRAINT "garantia_FK" FOREIGN KEY (garantia) REFERENCES garantias(id);


--
-- Name: giro_negocio_FK; Type: FK CONSTRAINT; Schema: inventario; Owner: postgres
--

ALTER TABLE ONLY bodegas
    ADD CONSTRAINT "giro_negocio_FK" FOREIGN KEY (giro_negocio) REFERENCES administracion.tipo_bienes_servicios(id);


--
-- Name: id_producto; Type: FK CONSTRAINT; Schema: inventario; Owner: postgres
--

ALTER TABLE ONLY descripcion_producto
    ADD CONSTRAINT id_producto FOREIGN KEY (producto) REFERENCES productos(id);


--
-- Name: id_producto; Type: FK CONSTRAINT; Schema: inventario; Owner: postgres
--

ALTER TABLE ONLY manejo_presios
    ADD CONSTRAINT id_producto FOREIGN KEY (id_producto) REFERENCES productos(id);


--
-- Name: id_producto_FK; Type: FK CONSTRAINT; Schema: inventario; Owner: postgres
--

ALTER TABLE ONLY imagenes_productos
    ADD CONSTRAINT "id_producto_FK" FOREIGN KEY (producto) REFERENCES productos(id);


--
-- Name: impuesto_FK; Type: FK CONSTRAINT; Schema: inventario; Owner: postgres
--

ALTER TABLE ONLY productos_impuestos
    ADD CONSTRAINT "impuesto_FK" FOREIGN KEY (impuesto) REFERENCES contabilidad.impuestos(id);


--
-- Name: marca_FK; Type: FK CONSTRAINT; Schema: inventario; Owner: postgres
--

ALTER TABLE ONLY productos
    ADD CONSTRAINT "marca_FK" FOREIGN KEY (marca) REFERENCES marcas(id);


--
-- Name: modelo_FK; Type: FK CONSTRAINT; Schema: inventario; Owner: postgres
--

ALTER TABLE ONLY productos
    ADD CONSTRAINT "modelo_FK" FOREIGN KEY (modelo) REFERENCES modelos(id);


--
-- Name: producto_tipo_consumo_FK; Type: FK CONSTRAINT; Schema: inventario; Owner: postgres
--

ALTER TABLE ONLY productos
    ADD CONSTRAINT "producto_tipo_consumo_FK" FOREIGN KEY (tipo_consumo) REFERENCES tipo_consumo(id);


--
-- Name: tipo_catalogo_FK; Type: FK CONSTRAINT; Schema: inventario; Owner: postgres
--

ALTER TABLE ONLY catalogos
    ADD CONSTRAINT "tipo_catalogo_FK" FOREIGN KEY (tipo_catalogo) REFERENCES tipos_catalogos(id);


--
-- Name: tipo_categoria_FK; Type: FK CONSTRAINT; Schema: inventario; Owner: postgres
--

ALTER TABLE ONLY categorias
    ADD CONSTRAINT "tipo_categoria_FK" FOREIGN KEY (tipo_categoria) REFERENCES tipos_categorias(id);


--
-- Name: tipo_garantia_FK; Type: FK CONSTRAINT; Schema: inventario; Owner: postgres
--

ALTER TABLE ONLY garantias
    ADD CONSTRAINT "tipo_garantia_FK" FOREIGN KEY (tipo_garantia) REFERENCES tipos_garantias(id);


--
-- Name: tipo_imagen_producto; Type: FK CONSTRAINT; Schema: inventario; Owner: postgres
--

ALTER TABLE ONLY imagenes_productos
    ADD CONSTRAINT tipo_imagen_producto FOREIGN KEY (tipo_imagen) REFERENCES tipos_imagenes_productos(id);


--
-- Name: ubicacion_FK; Type: FK CONSTRAINT; Schema: inventario; Owner: postgres
--

ALTER TABLE ONLY productos
    ADD CONSTRAINT "ubicacion_FK" FOREIGN KEY (ubicacion) REFERENCES ubicaciones(id);


SET search_path = public, pg_catalog;

--
-- Name: estado_FK; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY tipo_documento_identificacion
    ADD CONSTRAINT "estado_FK" FOREIGN KEY (estado) REFERENCES estados(id);


--
-- Name: estado_FK; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY operadoras_telefonicas
    ADD CONSTRAINT "estado_FK" FOREIGN KEY (estado) REFERENCES estados(id);


--
-- Name: estado_FK; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY personas_documentos_identificacion
    ADD CONSTRAINT "estado_FK" FOREIGN KEY (estado) REFERENCES estados(id);


--
-- Name: estado_FK; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY personas_correo_electronico
    ADD CONSTRAINT "estado_FK" FOREIGN KEY (estado) REFERENCES estados(id);


--
-- Name: id_persona_FK; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY telefonos_personas
    ADD CONSTRAINT "id_persona_FK" FOREIGN KEY (id_persona) REFERENCES personas(id);


--
-- Name: persona_FK; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY personas_documentos_identificacion
    ADD CONSTRAINT "persona_FK" FOREIGN KEY (id_persona) REFERENCES personas(id);


--
-- Name: telefonos_personas_operadora_telefocnica_FK; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY telefonos_personas
    ADD CONSTRAINT "telefonos_personas_operadora_telefocnica_FK" FOREIGN KEY (id_operadora_telefonica) REFERENCES operadoras_telefonicas(id);


--
-- Name: tipo_documento_FK; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY personas_documentos_identificacion
    ADD CONSTRAINT "tipo_documento_FK" FOREIGN KEY (id_tipo_documento) REFERENCES tipo_documento_identificacion(id);


SET search_path = talento_humano, pg_catalog;

--
-- Name: estado; Type: FK CONSTRAINT; Schema: talento_humano; Owner: postgres
--

ALTER TABLE ONLY tipos_contratos
    ADD CONSTRAINT estado FOREIGN KEY (estado) REFERENCES public.estados(id);


--
-- Name: estado_empleado_FK; Type: FK CONSTRAINT; Schema: talento_humano; Owner: postgres
--

ALTER TABLE ONLY empleados
    ADD CONSTRAINT "estado_empleado_FK" FOREIGN KEY (estado) REFERENCES public.estados(id);


--
-- Name: id_cargo_FK; Type: FK CONSTRAINT; Schema: talento_humano; Owner: postgres
--

ALTER TABLE ONLY empleados
    ADD CONSTRAINT "id_cargo_FK" FOREIGN KEY (id_cargo) REFERENCES administracion.empresas(id);


--
-- Name: id_persona_empleado_FK; Type: FK CONSTRAINT; Schema: talento_humano; Owner: postgres
--

ALTER TABLE ONLY empleados
    ADD CONSTRAINT "id_persona_empleado_FK" FOREIGN KEY (id_persona) REFERENCES public.personas(id);


--
-- Name: id_usuario_empleado_FK; Type: FK CONSTRAINT; Schema: talento_humano; Owner: postgres
--

ALTER TABLE ONLY empleados
    ADD CONSTRAINT "id_usuario_empleado_FK" FOREIGN KEY (id_usuario) REFERENCES usuarios.usuarios(id);


SET search_path = taller_mecanico, pg_catalog;

--
-- Name: Empresa_aseguradora_FK; Type: FK CONSTRAINT; Schema: taller_mecanico; Owner: postgres
--

ALTER TABLE ONLY "Aseguradora"
    ADD CONSTRAINT "Empresa_aseguradora_FK" FOREIGN KEY (id_empresa) REFERENCES administracion.empresas(id);


SET search_path = usuarios, pg_catalog;

--
-- Name: estado_FK; Type: FK CONSTRAINT; Schema: usuarios; Owner: postgres
--

ALTER TABLE ONLY tipo_usuario
    ADD CONSTRAINT "estado_FK" FOREIGN KEY (estado) REFERENCES public.estados(id);


--
-- Name: id_persona; Type: FK CONSTRAINT; Schema: usuarios; Owner: postgres
--

ALTER TABLE ONLY usuarios
    ADD CONSTRAINT id_persona FOREIGN KEY (id_persona) REFERENCES public.personas(id) ON UPDATE CASCADE ON DELETE CASCADE;


SET search_path = ventas, pg_catalog;

--
-- Name: factura_estado_FK; Type: FK CONSTRAINT; Schema: ventas; Owner: postgres
--

ALTER TABLE ONLY facturas
    ADD CONSTRAINT "factura_estado_FK" FOREIGN KEY (estado) REFERENCES public.estados(id);


--
-- Name: forma_pago_estado_FK; Type: FK CONSTRAINT; Schema: ventas; Owner: postgres
--

ALTER TABLE ONLY formas_pago
    ADD CONSTRAINT "forma_pago_estado_FK" FOREIGN KEY (estado) REFERENCES public.estados(id);


--
-- Name: id_caja_FK; Type: FK CONSTRAINT; Schema: ventas; Owner: postgres
--

ALTER TABLE ONLY caja_usuario
    ADD CONSTRAINT "id_caja_FK" FOREIGN KEY (id_caja) REFERENCES caja(id);


--
-- Name: id_empleado; Type: FK CONSTRAINT; Schema: ventas; Owner: postgres
--

ALTER TABLE ONLY empleado_factura
    ADD CONSTRAINT id_empleado FOREIGN KEY (id_empleado) REFERENCES talento_humano.empleados(id);


--
-- Name: id_empleado_FK; Type: FK CONSTRAINT; Schema: ventas; Owner: postgres
--

ALTER TABLE ONLY caja_usuario
    ADD CONSTRAINT "id_empleado_FK" FOREIGN KEY (id_empleado) REFERENCES talento_humano.empleados(id);


--
-- Name: id_factura_FK; Type: FK CONSTRAINT; Schema: ventas; Owner: postgres
--

ALTER TABLE ONLY clave_factura
    ADD CONSTRAINT "id_factura_FK" FOREIGN KEY (id_factura) REFERENCES facturas(id);


--
-- Name: id_usuario_FK; Type: FK CONSTRAINT; Schema: ventas; Owner: postgres
--

ALTER TABLE ONLY caja_usuario
    ADD CONSTRAINT "id_usuario_FK" FOREIGN KEY (id_usuario) REFERENCES usuarios.usuarios(id);


--
-- Name: producto_catalogo_catalogo; Type: FK CONSTRAINT; Schema: ventas; Owner: postgres
--

ALTER TABLE ONLY producto_descuento
    ADD CONSTRAINT producto_catalogo_catalogo FOREIGN KEY (id_catalogo) REFERENCES inventario.catalogos(id);


--
-- Name: public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE ALL ON SCHEMA public FROM PUBLIC;
REVOKE ALL ON SCHEMA public FROM postgres;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO PUBLIC;


--
-- PostgreSQL database dump complete
--

