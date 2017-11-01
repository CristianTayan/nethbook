--
-- PostgreSQL database dump
--

-- Dumped from database version 9.2.23
-- Dumped by pg_dump version 9.2.23
-- Started on 2017-10-31 10:49:14 -05

SET statement_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;

--
-- TOC entry 7 (class 2615 OID 33118)
-- Name: Taller_mecanico; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA "Taller_mecanico";


ALTER SCHEMA "Taller_mecanico" OWNER TO postgres;

--
-- TOC entry 8 (class 2615 OID 33119)
-- Name: administracion; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA administracion;


ALTER SCHEMA administracion OWNER TO postgres;

--
-- TOC entry 9 (class 2615 OID 33120)
-- Name: auditoria; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA auditoria;


ALTER SCHEMA auditoria OWNER TO postgres;

--
-- TOC entry 3947 (class 0 OID 0)
-- Dependencies: 9
-- Name: SCHEMA auditoria; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON SCHEMA auditoria IS 'auditoria de los cambios en la bd';


--
-- TOC entry 10 (class 2615 OID 33121)
-- Name: contabilidad; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA contabilidad;


ALTER SCHEMA contabilidad OWNER TO postgres;

--
-- TOC entry 11 (class 2615 OID 33122)
-- Name: inventario; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA inventario;


ALTER SCHEMA inventario OWNER TO postgres;

--
-- TOC entry 12 (class 2615 OID 33123)
-- Name: talento_humano; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA talento_humano;


ALTER SCHEMA talento_humano OWNER TO postgres;

--
-- TOC entry 13 (class 2615 OID 33124)
-- Name: usuarios; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA usuarios;


ALTER SCHEMA usuarios OWNER TO postgres;

--
-- TOC entry 14 (class 2615 OID 33125)
-- Name: ventas; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA ventas;


ALTER SCHEMA ventas OWNER TO postgres;

--
-- TOC entry 1 (class 3079 OID 12649)
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- TOC entry 3950 (class 0 OID 0)
-- Dependencies: 1
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET search_path = public, pg_catalog;

--
-- TOC entry 339 (class 1255 OID 33126)
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
-- TOC entry 340 (class 1255 OID 33127)
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
-- TOC entry 341 (class 1255 OID 33128)
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
-- TOC entry 342 (class 1255 OID 33129)
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
-- TOC entry 343 (class 1255 OID 33130)
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

SET search_path = "Taller_mecanico", pg_catalog;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- TOC entry 177 (class 1259 OID 33131)
-- Name: Aseguradora; Type: TABLE; Schema: Taller_mecanico; Owner: postgres; Tablespace: 
--

CREATE TABLE "Aseguradora" (
    id integer NOT NULL,
    contacto json,
    id_empresa integer NOT NULL
);


ALTER TABLE "Taller_mecanico"."Aseguradora" OWNER TO postgres;

--
-- TOC entry 178 (class 1259 OID 33137)
-- Name: Aseguradora_id_seq; Type: SEQUENCE; Schema: Taller_mecanico; Owner: postgres
--

CREATE SEQUENCE "Aseguradora_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "Taller_mecanico"."Aseguradora_id_seq" OWNER TO postgres;

--
-- TOC entry 3951 (class 0 OID 0)
-- Dependencies: 178
-- Name: Aseguradora_id_seq; Type: SEQUENCE OWNED BY; Schema: Taller_mecanico; Owner: postgres
--

ALTER SEQUENCE "Aseguradora_id_seq" OWNED BY "Aseguradora".id;


SET search_path = administracion, pg_catalog;

--
-- TOC entry 179 (class 1259 OID 33139)
-- Name: actividad_economica; Type: TABLE; Schema: administracion; Owner: postgres; Tablespace: 
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


ALTER TABLE administracion.actividad_economica OWNER TO postgres;

--
-- TOC entry 180 (class 1259 OID 33146)
-- Name: actividad_economica_id_seq; Type: SEQUENCE; Schema: administracion; Owner: postgres
--

CREATE SEQUENCE actividad_economica_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE administracion.actividad_economica_id_seq OWNER TO postgres;

--
-- TOC entry 3952 (class 0 OID 0)
-- Dependencies: 180
-- Name: actividad_economica_id_seq; Type: SEQUENCE OWNED BY; Schema: administracion; Owner: postgres
--

ALTER SEQUENCE actividad_economica_id_seq OWNED BY actividad_economica.id;


--
-- TOC entry 181 (class 1259 OID 33148)
-- Name: clientes; Type: TABLE; Schema: administracion; Owner: postgres; Tablespace: 
--

CREATE TABLE clientes (
    id character varying(50) NOT NULL,
    tipo_cliente integer NOT NULL,
    id_cliente integer NOT NULL,
    id_tipo_documento integer NOT NULL,
    fecha timestamp without time zone DEFAULT now() NOT NULL,
    estado character varying NOT NULL
);


ALTER TABLE administracion.clientes OWNER TO postgres;

--
-- TOC entry 182 (class 1259 OID 33155)
-- Name: empresas; Type: TABLE; Schema: administracion; Owner: postgres; Tablespace: 
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


ALTER TABLE administracion.empresas OWNER TO postgres;

--
-- TOC entry 3953 (class 0 OID 0)
-- Dependencies: 182
-- Name: COLUMN empresas.id; Type: COMMENT; Schema: administracion; Owner: postgres
--

COMMENT ON COLUMN empresas.id IS 'define el identificador de la empresa';


--
-- TOC entry 3954 (class 0 OID 0)
-- Dependencies: 182
-- Name: COLUMN empresas.razon_social; Type: COMMENT; Schema: administracion; Owner: postgres
--

COMMENT ON COLUMN empresas.razon_social IS 'define la razon social de la empresa';


--
-- TOC entry 3955 (class 0 OID 0)
-- Dependencies: 182
-- Name: COLUMN empresas.actividad_economica; Type: COMMENT; Schema: administracion; Owner: postgres
--

COMMENT ON COLUMN empresas.actividad_economica IS 'actividad economica que realiza la empresa';


--
-- TOC entry 3956 (class 0 OID 0)
-- Dependencies: 182
-- Name: COLUMN empresas.ruc_ci; Type: COMMENT; Schema: administracion; Owner: postgres
--

COMMENT ON COLUMN empresas.ruc_ci IS 'ruc o cedula dependiendo el tipo de usuario';


--
-- TOC entry 3957 (class 0 OID 0)
-- Dependencies: 182
-- Name: COLUMN empresas.nombre_comercial; Type: COMMENT; Schema: administracion; Owner: postgres
--

COMMENT ON COLUMN empresas.nombre_comercial IS 'nombre con el que se le conoce a la empresa';


--
-- TOC entry 3958 (class 0 OID 0)
-- Dependencies: 182
-- Name: COLUMN empresas.tipo_persona; Type: COMMENT; Schema: administracion; Owner: postgres
--

COMMENT ON COLUMN empresas.tipo_persona IS 'tipo de persona natural o juridica segun SRI';


--
-- TOC entry 3959 (class 0 OID 0)
-- Dependencies: 182
-- Name: COLUMN empresas.id_estado; Type: COMMENT; Schema: administracion; Owner: postgres
--

COMMENT ON COLUMN empresas.id_estado IS 'define el estado de la empresa para el sistema Nexbook';


--
-- TOC entry 183 (class 1259 OID 33163)
-- Name: empresas_id_seq; Type: SEQUENCE; Schema: administracion; Owner: postgres
--

CREATE SEQUENCE empresas_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE administracion.empresas_id_seq OWNER TO postgres;

--
-- TOC entry 3960 (class 0 OID 0)
-- Dependencies: 183
-- Name: empresas_id_seq; Type: SEQUENCE OWNED BY; Schema: administracion; Owner: postgres
--

ALTER SEQUENCE empresas_id_seq OWNED BY empresas.id;


--
-- TOC entry 184 (class 1259 OID 33165)
-- Name: imagen_empresa; Type: TABLE; Schema: administracion; Owner: postgres; Tablespace: 
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


ALTER TABLE administracion.imagen_empresa OWNER TO postgres;

--
-- TOC entry 185 (class 1259 OID 33172)
-- Name: imagen_empresa_id_seq; Type: SEQUENCE; Schema: administracion; Owner: postgres
--

CREATE SEQUENCE imagen_empresa_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE administracion.imagen_empresa_id_seq OWNER TO postgres;

--
-- TOC entry 3961 (class 0 OID 0)
-- Dependencies: 185
-- Name: imagen_empresa_id_seq; Type: SEQUENCE OWNED BY; Schema: administracion; Owner: postgres
--

ALTER SEQUENCE imagen_empresa_id_seq OWNED BY imagen_empresa.id;


--
-- TOC entry 186 (class 1259 OID 33174)
-- Name: sucursales; Type: TABLE; Schema: administracion; Owner: postgres; Tablespace: 
--

CREATE TABLE sucursales (
    id integer NOT NULL,
    nombre character varying(250) NOT NULL,
    responsable integer NOT NULL,
    datos_empresariales json NOT NULL,
    localizacion_sucursal json NOT NULL,
    datos_adiconales json,
    codigo_sri character varying(3) NOT NULL,
    giro_negocio integer DEFAULT 0 NOT NULL,
    actividad_economica integer DEFAULT 0 NOT NULL,
    id_empresa integer
);


ALTER TABLE administracion.sucursales OWNER TO postgres;

--
-- TOC entry 187 (class 1259 OID 33182)
-- Name: sucursales_id_seq; Type: SEQUENCE; Schema: administracion; Owner: postgres
--

CREATE SEQUENCE sucursales_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE administracion.sucursales_id_seq OWNER TO postgres;

--
-- TOC entry 188 (class 1259 OID 33184)
-- Name: sucursales_id_seq1; Type: SEQUENCE; Schema: administracion; Owner: postgres
--

CREATE SEQUENCE sucursales_id_seq1
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE administracion.sucursales_id_seq1 OWNER TO postgres;

--
-- TOC entry 3962 (class 0 OID 0)
-- Dependencies: 188
-- Name: sucursales_id_seq1; Type: SEQUENCE OWNED BY; Schema: administracion; Owner: postgres
--

ALTER SEQUENCE sucursales_id_seq1 OWNED BY sucursales.id;


--
-- TOC entry 189 (class 1259 OID 33186)
-- Name: tipo_accion_vista; Type: TABLE; Schema: administracion; Owner: postgres; Tablespace: 
--

CREATE TABLE tipo_accion_vista (
    id integer NOT NULL,
    accion_ver boolean NOT NULL,
    accion_guardar boolean NOT NULL,
    accion_modificar boolean NOT NULL,
    estado character varying(5) NOT NULL,
    fecha timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE administracion.tipo_accion_vista OWNER TO postgres;

--
-- TOC entry 190 (class 1259 OID 33190)
-- Name: tipo_accion_vista_id_seq; Type: SEQUENCE; Schema: administracion; Owner: postgres
--

CREATE SEQUENCE tipo_accion_vista_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE administracion.tipo_accion_vista_id_seq OWNER TO postgres;

--
-- TOC entry 3963 (class 0 OID 0)
-- Dependencies: 190
-- Name: tipo_accion_vista_id_seq; Type: SEQUENCE OWNED BY; Schema: administracion; Owner: postgres
--

ALTER SEQUENCE tipo_accion_vista_id_seq OWNED BY tipo_accion_vista.id;


--
-- TOC entry 191 (class 1259 OID 33192)
-- Name: tipo_bienes_servicios; Type: TABLE; Schema: administracion; Owner: postgres; Tablespace: 
--

CREATE TABLE tipo_bienes_servicios (
    id integer NOT NULL,
    nombre character varying(75) NOT NULL,
    descripcion character varying(500) NOT NULL,
    fecha timestamp without time zone DEFAULT now() NOT NULL,
    estado character varying(5) NOT NULL,
    id_prestacion integer
);


ALTER TABLE administracion.tipo_bienes_servicios OWNER TO postgres;

--
-- TOC entry 192 (class 1259 OID 33199)
-- Name: tipo_bienes_servicios_id_seq; Type: SEQUENCE; Schema: administracion; Owner: postgres
--

CREATE SEQUENCE tipo_bienes_servicios_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE administracion.tipo_bienes_servicios_id_seq OWNER TO postgres;

--
-- TOC entry 3964 (class 0 OID 0)
-- Dependencies: 192
-- Name: tipo_bienes_servicios_id_seq; Type: SEQUENCE OWNED BY; Schema: administracion; Owner: postgres
--

ALTER SEQUENCE tipo_bienes_servicios_id_seq OWNED BY tipo_bienes_servicios.id;


--
-- TOC entry 193 (class 1259 OID 33201)
-- Name: tipo_empresa; Type: TABLE; Schema: administracion; Owner: postgres; Tablespace: 
--

CREATE TABLE tipo_empresa (
    id integer NOT NULL,
    nombre character(50) NOT NULL,
    descripcion character varying(500) NOT NULL,
    estado character varying(5) NOT NULL,
    fecha timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE administracion.tipo_empresa OWNER TO postgres;

--
-- TOC entry 194 (class 1259 OID 33208)
-- Name: tipo_empresa_id_seq; Type: SEQUENCE; Schema: administracion; Owner: postgres
--

CREATE SEQUENCE tipo_empresa_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE administracion.tipo_empresa_id_seq OWNER TO postgres;

--
-- TOC entry 3965 (class 0 OID 0)
-- Dependencies: 194
-- Name: tipo_empresa_id_seq; Type: SEQUENCE OWNED BY; Schema: administracion; Owner: postgres
--

ALTER SEQUENCE tipo_empresa_id_seq OWNED BY tipo_empresa.id;


--
-- TOC entry 195 (class 1259 OID 33210)
-- Name: tipos_imagenes_empresas; Type: TABLE; Schema: administracion; Owner: postgres; Tablespace: 
--

CREATE TABLE tipos_imagenes_empresas (
    id integer NOT NULL,
    nombre character varying(250) NOT NULL,
    estado character varying(5) NOT NULL,
    fecha timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE administracion.tipos_imagenes_empresas OWNER TO postgres;

--
-- TOC entry 196 (class 1259 OID 33214)
-- Name: tipos_imagenes_productos_id_seq; Type: SEQUENCE; Schema: administracion; Owner: postgres
--

CREATE SEQUENCE tipos_imagenes_productos_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE administracion.tipos_imagenes_productos_id_seq OWNER TO postgres;

--
-- TOC entry 3966 (class 0 OID 0)
-- Dependencies: 196
-- Name: tipos_imagenes_productos_id_seq; Type: SEQUENCE OWNED BY; Schema: administracion; Owner: postgres
--

ALTER SEQUENCE tipos_imagenes_productos_id_seq OWNED BY tipos_imagenes_empresas.id;


--
-- TOC entry 197 (class 1259 OID 33216)
-- Name: usuarios_privilegios; Type: TABLE; Schema: administracion; Owner: postgres; Tablespace: 
--

CREATE TABLE usuarios_privilegios (
    id integer NOT NULL,
    estado character varying(5) NOT NULL,
    fecha timestamp without time zone DEFAULT now() NOT NULL,
    id_vista integer NOT NULL,
    id_tipo_usuario integer NOT NULL,
    id_tipo_accion_vistas integer NOT NULL
);


ALTER TABLE administracion.usuarios_privilegios OWNER TO postgres;

--
-- TOC entry 198 (class 1259 OID 33220)
-- Name: usuarios_privilegios_id_seq; Type: SEQUENCE; Schema: administracion; Owner: postgres
--

CREATE SEQUENCE usuarios_privilegios_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE administracion.usuarios_privilegios_id_seq OWNER TO postgres;

--
-- TOC entry 3967 (class 0 OID 0)
-- Dependencies: 198
-- Name: usuarios_privilegios_id_seq; Type: SEQUENCE OWNED BY; Schema: administracion; Owner: postgres
--

ALTER SEQUENCE usuarios_privilegios_id_seq OWNED BY usuarios_privilegios.id;


--
-- TOC entry 199 (class 1259 OID 33222)
-- Name: vistas; Type: TABLE; Schema: administracion; Owner: postgres; Tablespace: 
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


ALTER TABLE administracion.vistas OWNER TO postgres;

--
-- TOC entry 200 (class 1259 OID 33230)
-- Name: vistas_id_seq; Type: SEQUENCE; Schema: administracion; Owner: postgres
--

CREATE SEQUENCE vistas_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE administracion.vistas_id_seq OWNER TO postgres;

--
-- TOC entry 3968 (class 0 OID 0)
-- Dependencies: 200
-- Name: vistas_id_seq; Type: SEQUENCE OWNED BY; Schema: administracion; Owner: postgres
--

ALTER SEQUENCE vistas_id_seq OWNED BY vistas.id;


SET search_path = auditoria, pg_catalog;

--
-- TOC entry 201 (class 1259 OID 33232)
-- Name: auditoria; Type: TABLE; Schema: auditoria; Owner: postgres; Tablespace: 
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


ALTER TABLE auditoria.auditoria OWNER TO postgres;

--
-- TOC entry 3969 (class 0 OID 0)
-- Dependencies: 201
-- Name: COLUMN auditoria.id; Type: COMMENT; Schema: auditoria; Owner: postgres
--

COMMENT ON COLUMN auditoria.id IS 'define el identificador de la tabla auditoria';


--
-- TOC entry 3970 (class 0 OID 0)
-- Dependencies: 201
-- Name: COLUMN auditoria.tabla_afectada; Type: COMMENT; Schema: auditoria; Owner: postgres
--

COMMENT ON COLUMN auditoria.tabla_afectada IS 'almacena el nombre de la tabla que fue afectada';


--
-- TOC entry 3971 (class 0 OID 0)
-- Dependencies: 201
-- Name: COLUMN auditoria.operacion; Type: COMMENT; Schema: auditoria; Owner: postgres
--

COMMENT ON COLUMN auditoria.operacion IS 'guarda la operacion realizada, I insertar / U actualizar/ D borrar  ';


--
-- TOC entry 3972 (class 0 OID 0)
-- Dependencies: 201
-- Name: COLUMN auditoria.variable_anterior; Type: COMMENT; Schema: auditoria; Owner: postgres
--

COMMENT ON COLUMN auditoria.variable_anterior IS 'almacena los valores viejos';


--
-- TOC entry 3973 (class 0 OID 0)
-- Dependencies: 201
-- Name: COLUMN auditoria.variable_nueva; Type: COMMENT; Schema: auditoria; Owner: postgres
--

COMMENT ON COLUMN auditoria.variable_nueva IS 'almacena los valores nuevos';


--
-- TOC entry 3974 (class 0 OID 0)
-- Dependencies: 201
-- Name: COLUMN auditoria.fecha; Type: COMMENT; Schema: auditoria; Owner: postgres
--

COMMENT ON COLUMN auditoria.fecha IS 'almacena la fecha de modificacion de los datos';


--
-- TOC entry 3975 (class 0 OID 0)
-- Dependencies: 201
-- Name: COLUMN auditoria.usuario; Type: COMMENT; Schema: auditoria; Owner: postgres
--

COMMENT ON COLUMN auditoria.usuario IS 'almacena el usuario de la BDD';


--
-- TOC entry 202 (class 1259 OID 33238)
-- Name: auditoria_id_seq; Type: SEQUENCE; Schema: auditoria; Owner: postgres
--

CREATE SEQUENCE auditoria_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE auditoria.auditoria_id_seq OWNER TO postgres;

--
-- TOC entry 3976 (class 0 OID 0)
-- Dependencies: 202
-- Name: auditoria_id_seq; Type: SEQUENCE OWNED BY; Schema: auditoria; Owner: postgres
--

ALTER SEQUENCE auditoria_id_seq OWNED BY auditoria.id;


--
-- TOC entry 203 (class 1259 OID 33240)
-- Name: ingresos_usuarios; Type: TABLE; Schema: auditoria; Owner: postgres; Tablespace: 
--

CREATE TABLE ingresos_usuarios (
    id integer NOT NULL,
    usuario character varying(100) NOT NULL,
    informacion_servidor json NOT NULL,
    fecha timestamp without time zone DEFAULT now() NOT NULL,
    ip_acceso json NOT NULL
);


ALTER TABLE auditoria.ingresos_usuarios OWNER TO postgres;

--
-- TOC entry 204 (class 1259 OID 33247)
-- Name: ingresos_usuarios_id_seq; Type: SEQUENCE; Schema: auditoria; Owner: postgres
--

CREATE SEQUENCE ingresos_usuarios_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE auditoria.ingresos_usuarios_id_seq OWNER TO postgres;

--
-- TOC entry 3977 (class 0 OID 0)
-- Dependencies: 204
-- Name: ingresos_usuarios_id_seq; Type: SEQUENCE OWNED BY; Schema: auditoria; Owner: postgres
--

ALTER SEQUENCE ingresos_usuarios_id_seq OWNED BY ingresos_usuarios.id;


SET search_path = contabilidad, pg_catalog;

--
-- TOC entry 205 (class 1259 OID 33249)
-- Name: plazos_credito; Type: TABLE; Schema: contabilidad; Owner: postgres; Tablespace: 
--

CREATE TABLE plazos_credito (
    id integer NOT NULL,
    nombre character varying(50) NOT NULL,
    dias_credito integer DEFAULT 0 NOT NULL,
    estado character varying(5) NOT NULL,
    fecha time without time zone DEFAULT now() NOT NULL
);


ALTER TABLE contabilidad.plazos_credito OWNER TO postgres;

--
-- TOC entry 206 (class 1259 OID 33254)
-- Name: Plazos_credito_id_seq; Type: SEQUENCE; Schema: contabilidad; Owner: postgres
--

CREATE SEQUENCE "Plazos_credito_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE contabilidad."Plazos_credito_id_seq" OWNER TO postgres;

--
-- TOC entry 3978 (class 0 OID 0)
-- Dependencies: 206
-- Name: Plazos_credito_id_seq; Type: SEQUENCE OWNED BY; Schema: contabilidad; Owner: postgres
--

ALTER SEQUENCE "Plazos_credito_id_seq" OWNED BY plazos_credito.id;


--
-- TOC entry 207 (class 1259 OID 33256)
-- Name: ambitos_impuestos; Type: TABLE; Schema: contabilidad; Owner: postgres; Tablespace: 
--

CREATE TABLE ambitos_impuestos (
    id integer NOT NULL,
    nombre character varying(250) NOT NULL,
    estado character varying(5) NOT NULL,
    fecha date DEFAULT now() NOT NULL
);


ALTER TABLE contabilidad.ambitos_impuestos OWNER TO postgres;

--
-- TOC entry 208 (class 1259 OID 33260)
-- Name: ambitos_impuestos_id_seq; Type: SEQUENCE; Schema: contabilidad; Owner: postgres
--

CREATE SEQUENCE ambitos_impuestos_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE contabilidad.ambitos_impuestos_id_seq OWNER TO postgres;

--
-- TOC entry 3979 (class 0 OID 0)
-- Dependencies: 208
-- Name: ambitos_impuestos_id_seq; Type: SEQUENCE OWNED BY; Schema: contabilidad; Owner: postgres
--

ALTER SEQUENCE ambitos_impuestos_id_seq OWNED BY ambitos_impuestos.id;


--
-- TOC entry 209 (class 1259 OID 33262)
-- Name: asientos_contables_diario; Type: TABLE; Schema: contabilidad; Owner: postgres; Tablespace: 
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


ALTER TABLE contabilidad.asientos_contables_diario OWNER TO postgres;

--
-- TOC entry 210 (class 1259 OID 33266)
-- Name: asientos_contables_diario_id_seq; Type: SEQUENCE; Schema: contabilidad; Owner: postgres
--

CREATE SEQUENCE asientos_contables_diario_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE contabilidad.asientos_contables_diario_id_seq OWNER TO postgres;

--
-- TOC entry 3980 (class 0 OID 0)
-- Dependencies: 210
-- Name: asientos_contables_diario_id_seq; Type: SEQUENCE OWNED BY; Schema: contabilidad; Owner: postgres
--

ALTER SEQUENCE asientos_contables_diario_id_seq OWNED BY asientos_contables_diario.id;


--
-- TOC entry 211 (class 1259 OID 33268)
-- Name: bancos; Type: TABLE; Schema: contabilidad; Owner: postgres; Tablespace: 
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


ALTER TABLE contabilidad.bancos OWNER TO postgres;

--
-- TOC entry 212 (class 1259 OID 33275)
-- Name: bancos_id_seq; Type: SEQUENCE; Schema: contabilidad; Owner: postgres
--

CREATE SEQUENCE bancos_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE contabilidad.bancos_id_seq OWNER TO postgres;

--
-- TOC entry 3981 (class 0 OID 0)
-- Dependencies: 212
-- Name: bancos_id_seq; Type: SEQUENCE OWNED BY; Schema: contabilidad; Owner: postgres
--

ALTER SEQUENCE bancos_id_seq OWNED BY bancos.id;


--
-- TOC entry 213 (class 1259 OID 33277)
-- Name: cuentas_contables; Type: TABLE; Schema: contabilidad; Owner: postgres; Tablespace: 
--

CREATE TABLE cuentas_contables (
    id integer NOT NULL,
    codigo_contable character varying NOT NULL,
    nombre_corto character varying(50) NOT NULL,
    descripcion character varying(500) NOT NULL,
    signo_cuenta character(1) DEFAULT 0 NOT NULL,
    tipo_cuenta integer NOT NULL
);


ALTER TABLE contabilidad.cuentas_contables OWNER TO postgres;

--
-- TOC entry 214 (class 1259 OID 33284)
-- Name: cuentas_contables_id_seq; Type: SEQUENCE; Schema: contabilidad; Owner: postgres
--

CREATE SEQUENCE cuentas_contables_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE contabilidad.cuentas_contables_id_seq OWNER TO postgres;

--
-- TOC entry 3982 (class 0 OID 0)
-- Dependencies: 214
-- Name: cuentas_contables_id_seq; Type: SEQUENCE OWNED BY; Schema: contabilidad; Owner: postgres
--

ALTER SEQUENCE cuentas_contables_id_seq OWNED BY cuentas_contables.id;


--
-- TOC entry 215 (class 1259 OID 33286)
-- Name: repositorio_facturas_correo; Type: TABLE; Schema: contabilidad; Owner: postgres; Tablespace: 
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


ALTER TABLE contabilidad.repositorio_facturas_correo OWNER TO postgres;

--
-- TOC entry 216 (class 1259 OID 33293)
-- Name: facturas_correo_id_seq; Type: SEQUENCE; Schema: contabilidad; Owner: postgres
--

CREATE SEQUENCE facturas_correo_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE contabilidad.facturas_correo_id_seq OWNER TO postgres;

--
-- TOC entry 3983 (class 0 OID 0)
-- Dependencies: 216
-- Name: facturas_correo_id_seq; Type: SEQUENCE OWNED BY; Schema: contabilidad; Owner: postgres
--

ALTER SEQUENCE facturas_correo_id_seq OWNED BY repositorio_facturas_correo.id;


--
-- TOC entry 217 (class 1259 OID 33295)
-- Name: fecha_declaracion_ruc; Type: TABLE; Schema: contabilidad; Owner: postgres; Tablespace: 
--

CREATE TABLE fecha_declaracion_ruc (
    noveno_dig integer NOT NULL,
    fecha_maxima_declaracion character varying(50) NOT NULL,
    numero_dias integer NOT NULL
);


ALTER TABLE contabilidad.fecha_declaracion_ruc OWNER TO postgres;

--
-- TOC entry 218 (class 1259 OID 33298)
-- Name: finaciaminto; Type: TABLE; Schema: contabilidad; Owner: postgres; Tablespace: 
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


ALTER TABLE contabilidad.finaciaminto OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 33302)
-- Name: finaciaminto_id_seq; Type: SEQUENCE; Schema: contabilidad; Owner: postgres
--

CREATE SEQUENCE finaciaminto_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE contabilidad.finaciaminto_id_seq OWNER TO postgres;

--
-- TOC entry 3984 (class 0 OID 0)
-- Dependencies: 219
-- Name: finaciaminto_id_seq; Type: SEQUENCE OWNED BY; Schema: contabilidad; Owner: postgres
--

ALTER SEQUENCE finaciaminto_id_seq OWNED BY finaciaminto.id;


--
-- TOC entry 220 (class 1259 OID 33304)
-- Name: gasto_mes_repositorio; Type: TABLE; Schema: contabilidad; Owner: postgres; Tablespace: 
--

CREATE TABLE gasto_mes_repositorio (
    id integer NOT NULL,
    id_factura integer NOT NULL,
    id_tipo_gasto integer NOT NULL,
    total_gasto real NOT NULL,
    fecha date DEFAULT now() NOT NULL,
    estado_revicion character varying(5)
);


ALTER TABLE contabilidad.gasto_mes_repositorio OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 33308)
-- Name: gasto_mes_repositorio_id_seq; Type: SEQUENCE; Schema: contabilidad; Owner: postgres
--

CREATE SEQUENCE gasto_mes_repositorio_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE contabilidad.gasto_mes_repositorio_id_seq OWNER TO postgres;

--
-- TOC entry 3985 (class 0 OID 0)
-- Dependencies: 221
-- Name: gasto_mes_repositorio_id_seq; Type: SEQUENCE OWNED BY; Schema: contabilidad; Owner: postgres
--

ALTER SEQUENCE gasto_mes_repositorio_id_seq OWNED BY gasto_mes_repositorio.id;


--
-- TOC entry 222 (class 1259 OID 33310)
-- Name: gastos_impuestos_renta_deduccion; Type: TABLE; Schema: contabilidad; Owner: postgres; Tablespace: 
--

CREATE TABLE gastos_impuestos_renta_deduccion (
    id integer NOT NULL,
    id_factura integer NOT NULL,
    id_tipo_gasto_personal integer NOT NULL,
    valor_acumular real NOT NULL,
    estado character varying(5) NOT NULL,
    fecha date DEFAULT now() NOT NULL
);


ALTER TABLE contabilidad.gastos_impuestos_renta_deduccion OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 33314)
-- Name: gastos_impuestos_renta_deduccion_id_seq; Type: SEQUENCE; Schema: contabilidad; Owner: postgres
--

CREATE SEQUENCE gastos_impuestos_renta_deduccion_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE contabilidad.gastos_impuestos_renta_deduccion_id_seq OWNER TO postgres;

--
-- TOC entry 3986 (class 0 OID 0)
-- Dependencies: 223
-- Name: gastos_impuestos_renta_deduccion_id_seq; Type: SEQUENCE OWNED BY; Schema: contabilidad; Owner: postgres
--

ALTER SEQUENCE gastos_impuestos_renta_deduccion_id_seq OWNED BY gastos_impuestos_renta_deduccion.id;


--
-- TOC entry 224 (class 1259 OID 33316)
-- Name: genealogia_impuestos; Type: TABLE; Schema: contabilidad; Owner: postgres; Tablespace: 
--

CREATE TABLE genealogia_impuestos (
    id_impuesto_padre integer NOT NULL,
    id_impuesto_hijo integer NOT NULL
);


ALTER TABLE contabilidad.genealogia_impuestos OWNER TO postgres;

--
-- TOC entry 3987 (class 0 OID 0)
-- Dependencies: 224
-- Name: TABLE genealogia_impuestos; Type: COMMENT; Schema: contabilidad; Owner: postgres
--

COMMENT ON TABLE genealogia_impuestos IS 'define el arbol de los impuestos para el grupo';


--
-- TOC entry 225 (class 1259 OID 33319)
-- Name: grupo_impuestos; Type: TABLE; Schema: contabilidad; Owner: postgres; Tablespace: 
--

CREATE TABLE grupo_impuestos (
    id integer NOT NULL,
    nombre character varying(250) NOT NULL,
    estado character varying(5) NOT NULL,
    fecha timestamp with time zone NOT NULL
);


ALTER TABLE contabilidad.grupo_impuestos OWNER TO postgres;

--
-- TOC entry 226 (class 1259 OID 33322)
-- Name: grupo_impuestos_id_seq; Type: SEQUENCE; Schema: contabilidad; Owner: postgres
--

CREATE SEQUENCE grupo_impuestos_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE contabilidad.grupo_impuestos_id_seq OWNER TO postgres;

--
-- TOC entry 3988 (class 0 OID 0)
-- Dependencies: 226
-- Name: grupo_impuestos_id_seq; Type: SEQUENCE OWNED BY; Schema: contabilidad; Owner: postgres
--

ALTER SEQUENCE grupo_impuestos_id_seq OWNED BY grupo_impuestos.id;


--
-- TOC entry 227 (class 1259 OID 33324)
-- Name: impuestos; Type: TABLE; Schema: contabilidad; Owner: postgres; Tablespace: 
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


ALTER TABLE contabilidad.impuestos OWNER TO postgres;

--
-- TOC entry 228 (class 1259 OID 33333)
-- Name: impuestos_id_seq; Type: SEQUENCE; Schema: contabilidad; Owner: postgres
--

CREATE SEQUENCE impuestos_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE contabilidad.impuestos_id_seq OWNER TO postgres;

--
-- TOC entry 3989 (class 0 OID 0)
-- Dependencies: 228
-- Name: impuestos_id_seq; Type: SEQUENCE OWNED BY; Schema: contabilidad; Owner: postgres
--

ALTER SEQUENCE impuestos_id_seq OWNED BY impuestos.id;


--
-- TOC entry 229 (class 1259 OID 33335)
-- Name: repositorio_facturas; Type: TABLE; Schema: contabilidad; Owner: postgres; Tablespace: 
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


ALTER TABLE contabilidad.repositorio_facturas OWNER TO postgres;

--
-- TOC entry 230 (class 1259 OID 33342)
-- Name: repositorio_facturas_id_factura_seq; Type: SEQUENCE; Schema: contabilidad; Owner: postgres
--

CREATE SEQUENCE repositorio_facturas_id_factura_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE contabilidad.repositorio_facturas_id_factura_seq OWNER TO postgres;

--
-- TOC entry 3990 (class 0 OID 0)
-- Dependencies: 230
-- Name: repositorio_facturas_id_factura_seq; Type: SEQUENCE OWNED BY; Schema: contabilidad; Owner: postgres
--

ALTER SEQUENCE repositorio_facturas_id_factura_seq OWNED BY repositorio_facturas.id_factura;


--
-- TOC entry 231 (class 1259 OID 33344)
-- Name: repositorio_facturas_rechazadas; Type: TABLE; Schema: contabilidad; Owner: postgres; Tablespace: 
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


ALTER TABLE contabilidad.repositorio_facturas_rechazadas OWNER TO postgres;

--
-- TOC entry 232 (class 1259 OID 33351)
-- Name: repositorio_facturas_rechazadas_id_factura_r_seq; Type: SEQUENCE; Schema: contabilidad; Owner: postgres
--

CREATE SEQUENCE repositorio_facturas_rechazadas_id_factura_r_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE contabilidad.repositorio_facturas_rechazadas_id_factura_r_seq OWNER TO postgres;

--
-- TOC entry 3991 (class 0 OID 0)
-- Dependencies: 232
-- Name: repositorio_facturas_rechazadas_id_factura_r_seq; Type: SEQUENCE OWNED BY; Schema: contabilidad; Owner: postgres
--

ALTER SEQUENCE repositorio_facturas_rechazadas_id_factura_r_seq OWNED BY repositorio_facturas_rechazadas.id_factura_r;


--
-- TOC entry 233 (class 1259 OID 33353)
-- Name: rol_pagos_empleados; Type: TABLE; Schema: contabilidad; Owner: postgres; Tablespace: 
--

CREATE TABLE rol_pagos_empleados (
    id integer NOT NULL,
    id_empleado integer NOT NULL,
    mes_pago character varying(50) DEFAULT date_part('month'::text, now()) NOT NULL
);


ALTER TABLE contabilidad.rol_pagos_empleados OWNER TO postgres;

--
-- TOC entry 234 (class 1259 OID 33357)
-- Name: rol_pagos_empleados_id_seq; Type: SEQUENCE; Schema: contabilidad; Owner: postgres
--

CREATE SEQUENCE rol_pagos_empleados_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE contabilidad.rol_pagos_empleados_id_seq OWNER TO postgres;

--
-- TOC entry 3992 (class 0 OID 0)
-- Dependencies: 234
-- Name: rol_pagos_empleados_id_seq; Type: SEQUENCE OWNED BY; Schema: contabilidad; Owner: postgres
--

ALTER SEQUENCE rol_pagos_empleados_id_seq OWNED BY rol_pagos_empleados.id;


--
-- TOC entry 235 (class 1259 OID 33359)
-- Name: tipos_cuentas_contables; Type: TABLE; Schema: contabilidad; Owner: postgres; Tablespace: 
--

CREATE TABLE tipos_cuentas_contables (
    id integer NOT NULL,
    nombre character varying(250) NOT NULL,
    descripcion character varying(500) NOT NULL,
    estado character varying(5) NOT NULL,
    fecha timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE contabilidad.tipos_cuentas_contables OWNER TO postgres;

--
-- TOC entry 236 (class 1259 OID 33366)
-- Name: tipo_cuenta_contable_id_seq; Type: SEQUENCE; Schema: contabilidad; Owner: postgres
--

CREATE SEQUENCE tipo_cuenta_contable_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE contabilidad.tipo_cuenta_contable_id_seq OWNER TO postgres;

--
-- TOC entry 3993 (class 0 OID 0)
-- Dependencies: 236
-- Name: tipo_cuenta_contable_id_seq; Type: SEQUENCE OWNED BY; Schema: contabilidad; Owner: postgres
--

ALTER SEQUENCE tipo_cuenta_contable_id_seq OWNED BY tipos_cuentas_contables.id;


--
-- TOC entry 237 (class 1259 OID 33368)
-- Name: tipo_documentos; Type: TABLE; Schema: contabilidad; Owner: postgres; Tablespace: 
--

CREATE TABLE tipo_documentos (
    id character varying(5) NOT NULL,
    nombre character varying(50) NOT NULL,
    descripcion character varying(250) NOT NULL,
    estado character varying(5) NOT NULL,
    fecha timestamp(0) without time zone DEFAULT now()
);


ALTER TABLE contabilidad.tipo_documentos OWNER TO postgres;

--
-- TOC entry 238 (class 1259 OID 33372)
-- Name: tipo_impuestos; Type: TABLE; Schema: contabilidad; Owner: postgres; Tablespace: 
--

CREATE TABLE tipo_impuestos (
    id integer NOT NULL,
    nombre character varying(50) NOT NULL,
    descripcion character varying(250) NOT NULL,
    estado character varying(5) NOT NULL,
    fecha timestamp(0) without time zone DEFAULT now()
);


ALTER TABLE contabilidad.tipo_impuestos OWNER TO postgres;

--
-- TOC entry 239 (class 1259 OID 33376)
-- Name: tipo_impuestos_id_seq; Type: SEQUENCE; Schema: contabilidad; Owner: postgres
--

CREATE SEQUENCE tipo_impuestos_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE contabilidad.tipo_impuestos_id_seq OWNER TO postgres;

--
-- TOC entry 3994 (class 0 OID 0)
-- Dependencies: 239
-- Name: tipo_impuestos_id_seq; Type: SEQUENCE OWNED BY; Schema: contabilidad; Owner: postgres
--

ALTER SEQUENCE tipo_impuestos_id_seq OWNED BY tipo_impuestos.id;


--
-- TOC entry 240 (class 1259 OID 33378)
-- Name: tipos_gastos_personales; Type: TABLE; Schema: contabilidad; Owner: postgres; Tablespace: 
--

CREATE TABLE tipos_gastos_personales (
    id integer NOT NULL,
    nombre character varying(50) NOT NULL,
    descripcion character varying(500) NOT NULL,
    valor_maximo real NOT NULL,
    estado character varying(5),
    fecha date DEFAULT now() NOT NULL
);


ALTER TABLE contabilidad.tipos_gastos_personales OWNER TO postgres;

--
-- TOC entry 241 (class 1259 OID 33385)
-- Name: tipos_gastos_personales_id_seq; Type: SEQUENCE; Schema: contabilidad; Owner: postgres
--

CREATE SEQUENCE tipos_gastos_personales_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE contabilidad.tipos_gastos_personales_id_seq OWNER TO postgres;

--
-- TOC entry 3995 (class 0 OID 0)
-- Dependencies: 241
-- Name: tipos_gastos_personales_id_seq; Type: SEQUENCE OWNED BY; Schema: contabilidad; Owner: postgres
--

ALTER SEQUENCE tipos_gastos_personales_id_seq OWNED BY tipos_gastos_personales.id;


SET search_path = inventario, pg_catalog;

--
-- TOC entry 242 (class 1259 OID 33387)
-- Name: bodegas; Type: TABLE; Schema: inventario; Owner: postgres; Tablespace: 
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


ALTER TABLE inventario.bodegas OWNER TO postgres;

--
-- TOC entry 243 (class 1259 OID 33394)
-- Name: bodegas_id_seq; Type: SEQUENCE; Schema: inventario; Owner: postgres
--

CREATE SEQUENCE bodegas_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE inventario.bodegas_id_seq OWNER TO postgres;

--
-- TOC entry 3996 (class 0 OID 0)
-- Dependencies: 243
-- Name: bodegas_id_seq; Type: SEQUENCE OWNED BY; Schema: inventario; Owner: postgres
--

ALTER SEQUENCE bodegas_id_seq OWNED BY bodegas.id;


--
-- TOC entry 244 (class 1259 OID 33396)
-- Name: catalogos; Type: TABLE; Schema: inventario; Owner: postgres; Tablespace: 
--

CREATE TABLE catalogos (
    id integer NOT NULL,
    tipo_catalogo integer NOT NULL,
    producto integer NOT NULL
);


ALTER TABLE inventario.catalogos OWNER TO postgres;

--
-- TOC entry 245 (class 1259 OID 33399)
-- Name: catalogos_id_seq; Type: SEQUENCE; Schema: inventario; Owner: postgres
--

CREATE SEQUENCE catalogos_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE inventario.catalogos_id_seq OWNER TO postgres;

--
-- TOC entry 3997 (class 0 OID 0)
-- Dependencies: 245
-- Name: catalogos_id_seq; Type: SEQUENCE OWNED BY; Schema: inventario; Owner: postgres
--

ALTER SEQUENCE catalogos_id_seq OWNED BY catalogos.id;


--
-- TOC entry 246 (class 1259 OID 33401)
-- Name: categorias; Type: TABLE; Schema: inventario; Owner: postgres; Tablespace: 
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


ALTER TABLE inventario.categorias OWNER TO postgres;

--
-- TOC entry 247 (class 1259 OID 33409)
-- Name: categorias_id_seq; Type: SEQUENCE; Schema: inventario; Owner: postgres
--

CREATE SEQUENCE categorias_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE inventario.categorias_id_seq OWNER TO postgres;

--
-- TOC entry 3998 (class 0 OID 0)
-- Dependencies: 247
-- Name: categorias_id_seq; Type: SEQUENCE OWNED BY; Schema: inventario; Owner: postgres
--

ALTER SEQUENCE categorias_id_seq OWNED BY categorias.id;


--
-- TOC entry 248 (class 1259 OID 33411)
-- Name: descripcion_producto; Type: TABLE; Schema: inventario; Owner: postgres; Tablespace: 
--

CREATE TABLE descripcion_producto (
    id integer NOT NULL,
    producto integer NOT NULL,
    descripcion_corta character varying(2000) NOT NULL,
    descripcion_proveedor character varying(4000) NOT NULL,
    descripcion_proformas character varying(4000) NOT NULL,
    descripcion_movi_inventa character varying(4000) NOT NULL
);


ALTER TABLE inventario.descripcion_producto OWNER TO postgres;

--
-- TOC entry 3999 (class 0 OID 0)
-- Dependencies: 248
-- Name: COLUMN descripcion_producto.descripcion_corta; Type: COMMENT; Schema: inventario; Owner: postgres
--

COMMENT ON COLUMN descripcion_producto.descripcion_corta IS 'descripcion en caso de ubicar en la factura';


--
-- TOC entry 4000 (class 0 OID 0)
-- Dependencies: 248
-- Name: COLUMN descripcion_producto.descripcion_proveedor; Type: COMMENT; Schema: inventario; Owner: postgres
--

COMMENT ON COLUMN descripcion_producto.descripcion_proveedor IS 'descripcion para poner en solicitud del proveedor';


--
-- TOC entry 249 (class 1259 OID 33417)
-- Name: descripcion_producto_id_seq; Type: SEQUENCE; Schema: inventario; Owner: postgres
--

CREATE SEQUENCE descripcion_producto_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE inventario.descripcion_producto_id_seq OWNER TO postgres;

--
-- TOC entry 4001 (class 0 OID 0)
-- Dependencies: 249
-- Name: descripcion_producto_id_seq; Type: SEQUENCE OWNED BY; Schema: inventario; Owner: postgres
--

ALTER SEQUENCE descripcion_producto_id_seq OWNED BY descripcion_producto.id;


--
-- TOC entry 250 (class 1259 OID 33419)
-- Name: estado_descriptivo; Type: TABLE; Schema: inventario; Owner: postgres; Tablespace: 
--

CREATE TABLE estado_descriptivo (
    id integer NOT NULL,
    nombre character varying(250) NOT NULL,
    descripcion character varying(2000) NOT NULL,
    estado character varying(5) NOT NULL,
    fecha timestamp with time zone DEFAULT now() NOT NULL,
    id_padre integer
);


ALTER TABLE inventario.estado_descriptivo OWNER TO postgres;

--
-- TOC entry 251 (class 1259 OID 33426)
-- Name: estado_descriptivo_id_seq; Type: SEQUENCE; Schema: inventario; Owner: postgres
--

CREATE SEQUENCE estado_descriptivo_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE inventario.estado_descriptivo_id_seq OWNER TO postgres;

--
-- TOC entry 4002 (class 0 OID 0)
-- Dependencies: 251
-- Name: estado_descriptivo_id_seq; Type: SEQUENCE OWNED BY; Schema: inventario; Owner: postgres
--

ALTER SEQUENCE estado_descriptivo_id_seq OWNED BY estado_descriptivo.id;


--
-- TOC entry 252 (class 1259 OID 33428)
-- Name: garantias; Type: TABLE; Schema: inventario; Owner: postgres; Tablespace: 
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


ALTER TABLE inventario.garantias OWNER TO postgres;

--
-- TOC entry 4003 (class 0 OID 0)
-- Dependencies: 252
-- Name: COLUMN garantias.duracion; Type: COMMENT; Schema: inventario; Owner: postgres
--

COMMENT ON COLUMN garantias.duracion IS 'duracion en meses de la garantia';


--
-- TOC entry 253 (class 1259 OID 33435)
-- Name: garantias_id_seq; Type: SEQUENCE; Schema: inventario; Owner: postgres
--

CREATE SEQUENCE garantias_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE inventario.garantias_id_seq OWNER TO postgres;

--
-- TOC entry 4004 (class 0 OID 0)
-- Dependencies: 253
-- Name: garantias_id_seq; Type: SEQUENCE OWNED BY; Schema: inventario; Owner: postgres
--

ALTER SEQUENCE garantias_id_seq OWNED BY garantias.id;


--
-- TOC entry 254 (class 1259 OID 33437)
-- Name: imagenes_productos; Type: TABLE; Schema: inventario; Owner: postgres; Tablespace: 
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


ALTER TABLE inventario.imagenes_productos OWNER TO postgres;

--
-- TOC entry 4005 (class 0 OID 0)
-- Dependencies: 254
-- Name: COLUMN imagenes_productos.id; Type: COMMENT; Schema: inventario; Owner: postgres
--

COMMENT ON COLUMN imagenes_productos.id IS 'identificador';


--
-- TOC entry 4006 (class 0 OID 0)
-- Dependencies: 254
-- Name: COLUMN imagenes_productos.nombre; Type: COMMENT; Schema: inventario; Owner: postgres
--

COMMENT ON COLUMN imagenes_productos.nombre IS 'nombre de la imagen';


--
-- TOC entry 4007 (class 0 OID 0)
-- Dependencies: 254
-- Name: COLUMN imagenes_productos.direccion; Type: COMMENT; Schema: inventario; Owner: postgres
--

COMMENT ON COLUMN imagenes_productos.direccion IS 'direccion donde se encuentra la imagen';


--
-- TOC entry 4008 (class 0 OID 0)
-- Dependencies: 254
-- Name: COLUMN imagenes_productos.tipo_imagen; Type: COMMENT; Schema: inventario; Owner: postgres
--

COMMENT ON COLUMN imagenes_productos.tipo_imagen IS 'codigo del tipo de imagen';


--
-- TOC entry 255 (class 1259 OID 33441)
-- Name: manejo_presios; Type: TABLE; Schema: inventario; Owner: postgres; Tablespace: 
--

CREATE TABLE manejo_presios (
    id integer NOT NULL,
    id_producto integer NOT NULL,
    nombre character varying NOT NULL,
    valor_precio real NOT NULL,
    estado character varying NOT NULL,
    fecha timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE inventario.manejo_presios OWNER TO postgres;

--
-- TOC entry 256 (class 1259 OID 33448)
-- Name: manejo_presios_id_seq; Type: SEQUENCE; Schema: inventario; Owner: postgres
--

CREATE SEQUENCE manejo_presios_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE inventario.manejo_presios_id_seq OWNER TO postgres;

--
-- TOC entry 4009 (class 0 OID 0)
-- Dependencies: 256
-- Name: manejo_presios_id_seq; Type: SEQUENCE OWNED BY; Schema: inventario; Owner: postgres
--

ALTER SEQUENCE manejo_presios_id_seq OWNED BY manejo_presios.id;


--
-- TOC entry 257 (class 1259 OID 33450)
-- Name: marcas; Type: TABLE; Schema: inventario; Owner: postgres; Tablespace: 
--

CREATE TABLE marcas (
    id integer NOT NULL,
    nombre character varying(50) NOT NULL,
    descripcion character varying(2000) NOT NULL,
    estado character varying(5) NOT NULL,
    fecha timestamp with time zone DEFAULT now() NOT NULL,
    id_padre integer NOT NULL
);


ALTER TABLE inventario.marcas OWNER TO postgres;

--
-- TOC entry 258 (class 1259 OID 33457)
-- Name: marcas_id_seq; Type: SEQUENCE; Schema: inventario; Owner: postgres
--

CREATE SEQUENCE marcas_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE inventario.marcas_id_seq OWNER TO postgres;

--
-- TOC entry 4010 (class 0 OID 0)
-- Dependencies: 258
-- Name: marcas_id_seq; Type: SEQUENCE OWNED BY; Schema: inventario; Owner: postgres
--

ALTER SEQUENCE marcas_id_seq OWNED BY marcas.id;


--
-- TOC entry 259 (class 1259 OID 33459)
-- Name: modelos; Type: TABLE; Schema: inventario; Owner: postgres; Tablespace: 
--

CREATE TABLE modelos (
    id integer NOT NULL,
    nombre character varying(250) NOT NULL,
    descripcion character varying(2000) NOT NULL,
    estado character varying(5) NOT NULL,
    fecha timestamp with time zone DEFAULT now() NOT NULL,
    id_padre integer NOT NULL
);


ALTER TABLE inventario.modelos OWNER TO postgres;

--
-- TOC entry 260 (class 1259 OID 33466)
-- Name: modelos_id_seq; Type: SEQUENCE; Schema: inventario; Owner: postgres
--

CREATE SEQUENCE modelos_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE inventario.modelos_id_seq OWNER TO postgres;

--
-- TOC entry 4011 (class 0 OID 0)
-- Dependencies: 260
-- Name: modelos_id_seq; Type: SEQUENCE OWNED BY; Schema: inventario; Owner: postgres
--

ALTER SEQUENCE modelos_id_seq OWNED BY modelos.id;


--
-- TOC entry 261 (class 1259 OID 33468)
-- Name: productos; Type: TABLE; Schema: inventario; Owner: postgres; Tablespace: 
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


ALTER TABLE inventario.productos OWNER TO postgres;

--
-- TOC entry 262 (class 1259 OID 33474)
-- Name: productos_id_seq; Type: SEQUENCE; Schema: inventario; Owner: postgres
--

CREATE SEQUENCE productos_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE inventario.productos_id_seq OWNER TO postgres;

--
-- TOC entry 4012 (class 0 OID 0)
-- Dependencies: 262
-- Name: productos_id_seq; Type: SEQUENCE OWNED BY; Schema: inventario; Owner: postgres
--

ALTER SEQUENCE productos_id_seq OWNED BY productos.id;


--
-- TOC entry 263 (class 1259 OID 33476)
-- Name: productos_impuestos; Type: TABLE; Schema: inventario; Owner: postgres; Tablespace: 
--

CREATE TABLE productos_impuestos (
    id integer NOT NULL,
    producto integer NOT NULL,
    impuesto integer NOT NULL
);


ALTER TABLE inventario.productos_impuestos OWNER TO postgres;

--
-- TOC entry 264 (class 1259 OID 33479)
-- Name: productos_impuestos_id_seq; Type: SEQUENCE; Schema: inventario; Owner: postgres
--

CREATE SEQUENCE productos_impuestos_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE inventario.productos_impuestos_id_seq OWNER TO postgres;

--
-- TOC entry 4013 (class 0 OID 0)
-- Dependencies: 264
-- Name: productos_impuestos_id_seq; Type: SEQUENCE OWNED BY; Schema: inventario; Owner: postgres
--

ALTER SEQUENCE productos_impuestos_id_seq OWNED BY productos_impuestos.id;


--
-- TOC entry 265 (class 1259 OID 33481)
-- Name: proveedores; Type: TABLE; Schema: inventario; Owner: postgres; Tablespace: 
--

CREATE TABLE proveedores (
    id integer NOT NULL,
    nombre character varying(250) NOT NULL,
    ruc character varying(15) NOT NULL,
    direccion character varying(250) NOT NULL,
    id_empresa integer NOT NULL
);


ALTER TABLE inventario.proveedores OWNER TO postgres;

--
-- TOC entry 4014 (class 0 OID 0)
-- Dependencies: 265
-- Name: COLUMN proveedores.id_empresa; Type: COMMENT; Schema: inventario; Owner: postgres
--

COMMENT ON COLUMN proveedores.id_empresa IS 'conenta el probedor con los datos de su empresa';


--
-- TOC entry 266 (class 1259 OID 33487)
-- Name: proveedores_id_seq; Type: SEQUENCE; Schema: inventario; Owner: postgres
--

CREATE SEQUENCE proveedores_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE inventario.proveedores_id_seq OWNER TO postgres;

--
-- TOC entry 4015 (class 0 OID 0)
-- Dependencies: 266
-- Name: proveedores_id_seq; Type: SEQUENCE OWNED BY; Schema: inventario; Owner: postgres
--

ALTER SEQUENCE proveedores_id_seq OWNED BY proveedores.id;


--
-- TOC entry 267 (class 1259 OID 33489)
-- Name: tipo_consumo; Type: TABLE; Schema: inventario; Owner: postgres; Tablespace: 
--

CREATE TABLE tipo_consumo (
    id integer NOT NULL,
    nombre character varying(50) NOT NULL,
    descripcion character varying(2000) NOT NULL,
    estado character varying(5) NOT NULL,
    fecha timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE inventario.tipo_consumo OWNER TO postgres;

--
-- TOC entry 268 (class 1259 OID 33496)
-- Name: tipo_consumo_id_seq; Type: SEQUENCE; Schema: inventario; Owner: postgres
--

CREATE SEQUENCE tipo_consumo_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE inventario.tipo_consumo_id_seq OWNER TO postgres;

--
-- TOC entry 4016 (class 0 OID 0)
-- Dependencies: 268
-- Name: tipo_consumo_id_seq; Type: SEQUENCE OWNED BY; Schema: inventario; Owner: postgres
--

ALTER SEQUENCE tipo_consumo_id_seq OWNED BY tipo_consumo.id;


--
-- TOC entry 269 (class 1259 OID 33498)
-- Name: tipos_catalogos; Type: TABLE; Schema: inventario; Owner: postgres; Tablespace: 
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


ALTER TABLE inventario.tipos_catalogos OWNER TO postgres;

--
-- TOC entry 270 (class 1259 OID 33505)
-- Name: tipos_catalogos_id_seq; Type: SEQUENCE; Schema: inventario; Owner: postgres
--

CREATE SEQUENCE tipos_catalogos_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE inventario.tipos_catalogos_id_seq OWNER TO postgres;

--
-- TOC entry 4017 (class 0 OID 0)
-- Dependencies: 270
-- Name: tipos_catalogos_id_seq; Type: SEQUENCE OWNED BY; Schema: inventario; Owner: postgres
--

ALTER SEQUENCE tipos_catalogos_id_seq OWNED BY tipos_catalogos.id;


--
-- TOC entry 271 (class 1259 OID 33507)
-- Name: tipos_categorias; Type: TABLE; Schema: inventario; Owner: postgres; Tablespace: 
--

CREATE TABLE tipos_categorias (
    id integer NOT NULL,
    nombre character varying(50) NOT NULL,
    descripcion character varying(2000) NOT NULL,
    estado character varying(5) NOT NULL,
    fecha timestamp with time zone DEFAULT now()
);


ALTER TABLE inventario.tipos_categorias OWNER TO postgres;

--
-- TOC entry 272 (class 1259 OID 33514)
-- Name: tipos_categorias_id_seq; Type: SEQUENCE; Schema: inventario; Owner: postgres
--

CREATE SEQUENCE tipos_categorias_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE inventario.tipos_categorias_id_seq OWNER TO postgres;

--
-- TOC entry 4018 (class 0 OID 0)
-- Dependencies: 272
-- Name: tipos_categorias_id_seq; Type: SEQUENCE OWNED BY; Schema: inventario; Owner: postgres
--

ALTER SEQUENCE tipos_categorias_id_seq OWNED BY tipos_categorias.id;


--
-- TOC entry 273 (class 1259 OID 33516)
-- Name: tipos_garantias; Type: TABLE; Schema: inventario; Owner: postgres; Tablespace: 
--

CREATE TABLE tipos_garantias (
    id integer NOT NULL,
    nombre character varying(250) NOT NULL,
    descripcion character varying(2000),
    fecha timestamp with time zone DEFAULT now() NOT NULL,
    estado character varying(5)
);


ALTER TABLE inventario.tipos_garantias OWNER TO postgres;

--
-- TOC entry 4019 (class 0 OID 0)
-- Dependencies: 273
-- Name: COLUMN tipos_garantias.id; Type: COMMENT; Schema: inventario; Owner: postgres
--

COMMENT ON COLUMN tipos_garantias.id IS 'identificador';


--
-- TOC entry 4020 (class 0 OID 0)
-- Dependencies: 273
-- Name: COLUMN tipos_garantias.fecha; Type: COMMENT; Schema: inventario; Owner: postgres
--

COMMENT ON COLUMN tipos_garantias.fecha IS 'fechade creacion del tipo de garantia';


--
-- TOC entry 4021 (class 0 OID 0)
-- Dependencies: 273
-- Name: COLUMN tipos_garantias.estado; Type: COMMENT; Schema: inventario; Owner: postgres
--

COMMENT ON COLUMN tipos_garantias.estado IS 'define el estado del tipo de garantia';


--
-- TOC entry 274 (class 1259 OID 33523)
-- Name: tipos_garantias_id_seq; Type: SEQUENCE; Schema: inventario; Owner: postgres
--

CREATE SEQUENCE tipos_garantias_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE inventario.tipos_garantias_id_seq OWNER TO postgres;

--
-- TOC entry 4022 (class 0 OID 0)
-- Dependencies: 274
-- Name: tipos_garantias_id_seq; Type: SEQUENCE OWNED BY; Schema: inventario; Owner: postgres
--

ALTER SEQUENCE tipos_garantias_id_seq OWNED BY tipos_garantias.id;


--
-- TOC entry 275 (class 1259 OID 33525)
-- Name: tipos_imagenes_productos; Type: TABLE; Schema: inventario; Owner: postgres; Tablespace: 
--

CREATE TABLE tipos_imagenes_productos (
    id integer NOT NULL,
    nombre character varying(250) NOT NULL,
    estado character varying(5) NOT NULL,
    fecha timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE inventario.tipos_imagenes_productos OWNER TO postgres;

--
-- TOC entry 4023 (class 0 OID 0)
-- Dependencies: 275
-- Name: TABLE tipos_imagenes_productos; Type: COMMENT; Schema: inventario; Owner: postgres
--

COMMENT ON TABLE tipos_imagenes_productos IS 'contiene las direccioenes de las imagenes ';


--
-- TOC entry 4024 (class 0 OID 0)
-- Dependencies: 275
-- Name: COLUMN tipos_imagenes_productos.id; Type: COMMENT; Schema: inventario; Owner: postgres
--

COMMENT ON COLUMN tipos_imagenes_productos.id IS 'identificador de clave primaria';


--
-- TOC entry 4025 (class 0 OID 0)
-- Dependencies: 275
-- Name: COLUMN tipos_imagenes_productos.nombre; Type: COMMENT; Schema: inventario; Owner: postgres
--

COMMENT ON COLUMN tipos_imagenes_productos.nombre IS 'nombre del tipo de imagen';


--
-- TOC entry 4026 (class 0 OID 0)
-- Dependencies: 275
-- Name: COLUMN tipos_imagenes_productos.estado; Type: COMMENT; Schema: inventario; Owner: postgres
--

COMMENT ON COLUMN tipos_imagenes_productos.estado IS 'define si esta activo o no le tipo de imagen';


--
-- TOC entry 276 (class 1259 OID 33529)
-- Name: tipos_imagenes_productos_id_seq; Type: SEQUENCE; Schema: inventario; Owner: postgres
--

CREATE SEQUENCE tipos_imagenes_productos_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE inventario.tipos_imagenes_productos_id_seq OWNER TO postgres;

--
-- TOC entry 4027 (class 0 OID 0)
-- Dependencies: 276
-- Name: tipos_imagenes_productos_id_seq; Type: SEQUENCE OWNED BY; Schema: inventario; Owner: postgres
--

ALTER SEQUENCE tipos_imagenes_productos_id_seq OWNED BY tipos_imagenes_productos.id;


--
-- TOC entry 277 (class 1259 OID 33531)
-- Name: tipos_productos; Type: TABLE; Schema: inventario; Owner: postgres; Tablespace: 
--

CREATE TABLE tipos_productos (
    id integer NOT NULL,
    nombre character varying(250) NOT NULL,
    descripcion character varying(2000) NOT NULL,
    estado character varying(5) NOT NULL,
    fecha timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE inventario.tipos_productos OWNER TO postgres;

--
-- TOC entry 278 (class 1259 OID 33538)
-- Name: tipos_productos_id_seq; Type: SEQUENCE; Schema: inventario; Owner: postgres
--

CREATE SEQUENCE tipos_productos_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE inventario.tipos_productos_id_seq OWNER TO postgres;

--
-- TOC entry 4028 (class 0 OID 0)
-- Dependencies: 278
-- Name: tipos_productos_id_seq; Type: SEQUENCE OWNED BY; Schema: inventario; Owner: postgres
--

ALTER SEQUENCE tipos_productos_id_seq OWNED BY tipos_productos.id;


--
-- TOC entry 279 (class 1259 OID 33540)
-- Name: tipos_tipo_consumo; Type: TABLE; Schema: inventario; Owner: postgres; Tablespace: 
--

CREATE TABLE tipos_tipo_consumo (
    id integer NOT NULL,
    nombre character varying(50) NOT NULL,
    descripcion character varying(2000) NOT NULL,
    estado character varying(5) NOT NULL,
    fecha time with time zone DEFAULT now() NOT NULL
);


ALTER TABLE inventario.tipos_tipo_consumo OWNER TO postgres;

--
-- TOC entry 280 (class 1259 OID 33547)
-- Name: tipos_tipo_consumo_id_seq; Type: SEQUENCE; Schema: inventario; Owner: postgres
--

CREATE SEQUENCE tipos_tipo_consumo_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE inventario.tipos_tipo_consumo_id_seq OWNER TO postgres;

--
-- TOC entry 4029 (class 0 OID 0)
-- Dependencies: 280
-- Name: tipos_tipo_consumo_id_seq; Type: SEQUENCE OWNED BY; Schema: inventario; Owner: postgres
--

ALTER SEQUENCE tipos_tipo_consumo_id_seq OWNED BY tipos_tipo_consumo.id;


--
-- TOC entry 281 (class 1259 OID 33549)
-- Name: ubicaciones; Type: TABLE; Schema: inventario; Owner: postgres; Tablespace: 
--

CREATE TABLE ubicaciones (
    id integer NOT NULL,
    nombre character varying(250) NOT NULL,
    descripcion character varying(2000) NOT NULL,
    id_padre integer DEFAULT 0 NOT NULL,
    estado character varying(5) NOT NULL,
    fecha timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE inventario.ubicaciones OWNER TO postgres;

--
-- TOC entry 282 (class 1259 OID 33557)
-- Name: ubicaciones_id_seq; Type: SEQUENCE; Schema: inventario; Owner: postgres
--

CREATE SEQUENCE ubicaciones_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE inventario.ubicaciones_id_seq OWNER TO postgres;

--
-- TOC entry 4030 (class 0 OID 0)
-- Dependencies: 282
-- Name: ubicaciones_id_seq; Type: SEQUENCE OWNED BY; Schema: inventario; Owner: postgres
--

ALTER SEQUENCE ubicaciones_id_seq OWNED BY ubicaciones.id;


SET search_path = public, pg_catalog;

--
-- TOC entry 283 (class 1259 OID 33559)
-- Name: estados; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE estados (
    id character varying(5) NOT NULL,
    nombre character varying(50) NOT NULL,
    descripcion character varying(250) NOT NULL,
    fecha date DEFAULT now() NOT NULL
);


ALTER TABLE public.estados OWNER TO postgres;

--
-- TOC entry 4031 (class 0 OID 0)
-- Dependencies: 283
-- Name: COLUMN estados.id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN estados.id IS 'define el identificados';


--
-- TOC entry 4032 (class 0 OID 0)
-- Dependencies: 283
-- Name: COLUMN estados.nombre; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN estados.nombre IS 'define nombre corto del estado';


--
-- TOC entry 284 (class 1259 OID 33563)
-- Name: operadoras_telefonicas; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE operadoras_telefonicas (
    id integer NOT NULL,
    nombre character varying(50) NOT NULL,
    descripcion character varying(500) NOT NULL,
    estado character varying(5) NOT NULL,
    fecha time with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.operadoras_telefonicas OWNER TO postgres;

--
-- TOC entry 285 (class 1259 OID 33570)
-- Name: operadoras_telefonicas_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE operadoras_telefonicas_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.operadoras_telefonicas_id_seq OWNER TO postgres;

--
-- TOC entry 4033 (class 0 OID 0)
-- Dependencies: 285
-- Name: operadoras_telefonicas_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE operadoras_telefonicas_id_seq OWNED BY operadoras_telefonicas.id;


--
-- TOC entry 286 (class 1259 OID 33572)
-- Name: personas; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
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


ALTER TABLE public.personas OWNER TO postgres;

--
-- TOC entry 287 (class 1259 OID 33578)
-- Name: personas_correo_electronico; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE personas_correo_electronico (
    id integer NOT NULL,
    id_persona integer NOT NULL,
    correo_electronico character varying(250) NOT NULL,
    estado character varying(5) NOT NULL,
    fecha timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.personas_correo_electronico OWNER TO postgres;

--
-- TOC entry 288 (class 1259 OID 33582)
-- Name: personas_correo_electronico_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE personas_correo_electronico_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.personas_correo_electronico_id_seq OWNER TO postgres;

--
-- TOC entry 4034 (class 0 OID 0)
-- Dependencies: 288
-- Name: personas_correo_electronico_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE personas_correo_electronico_id_seq OWNED BY personas_correo_electronico.id;


--
-- TOC entry 289 (class 1259 OID 33584)
-- Name: personas_documentos_identificacion; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE personas_documentos_identificacion (
    id integer NOT NULL,
    id_persona integer NOT NULL,
    id_tipo_documento integer NOT NULL,
    numero_identificacion character varying(50) NOT NULL,
    estado character varying(5) NOT NULL,
    fecha time with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.personas_documentos_identificacion OWNER TO postgres;

--
-- TOC entry 290 (class 1259 OID 33588)
-- Name: personas_documentos_identificacion_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE personas_documentos_identificacion_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.personas_documentos_identificacion_id_seq OWNER TO postgres;

--
-- TOC entry 4035 (class 0 OID 0)
-- Dependencies: 290
-- Name: personas_documentos_identificacion_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE personas_documentos_identificacion_id_seq OWNED BY personas_documentos_identificacion.id;


--
-- TOC entry 291 (class 1259 OID 33590)
-- Name: personas_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE personas_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.personas_id_seq OWNER TO postgres;

--
-- TOC entry 4036 (class 0 OID 0)
-- Dependencies: 291
-- Name: personas_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE personas_id_seq OWNED BY personas.id;


--
-- TOC entry 292 (class 1259 OID 33592)
-- Name: telefonos_personas; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE telefonos_personas (
    id integer NOT NULL,
    id_persona integer NOT NULL,
    numero character varying(25) NOT NULL,
    fecha timestamp with time zone DEFAULT now() NOT NULL,
    estado character varying(5) NOT NULL,
    id_operadora_telefonica integer NOT NULL
);


ALTER TABLE public.telefonos_personas OWNER TO postgres;

--
-- TOC entry 293 (class 1259 OID 33596)
-- Name: telefonos_personas_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE telefonos_personas_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.telefonos_personas_id_seq OWNER TO postgres;

--
-- TOC entry 4037 (class 0 OID 0)
-- Dependencies: 293
-- Name: telefonos_personas_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE telefonos_personas_id_seq OWNED BY telefonos_personas.id;


--
-- TOC entry 294 (class 1259 OID 33598)
-- Name: tipo_documento_identificacion; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE tipo_documento_identificacion (
    id integer NOT NULL,
    nombre character varying(75) NOT NULL,
    descripcion character varying(2000) NOT NULL,
    estado character varying(5) NOT NULL,
    fecha time with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.tipo_documento_identificacion OWNER TO postgres;

--
-- TOC entry 295 (class 1259 OID 33605)
-- Name: tipo_documento_identificaion_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE tipo_documento_identificaion_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.tipo_documento_identificaion_id_seq OWNER TO postgres;

--
-- TOC entry 4038 (class 0 OID 0)
-- Dependencies: 295
-- Name: tipo_documento_identificaion_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE tipo_documento_identificaion_id_seq OWNED BY tipo_documento_identificacion.id;


--
-- TOC entry 296 (class 1259 OID 33607)
-- Name: view_categorias; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW view_categorias AS
    WITH RECURSIVE path(nombre, descripcion, path, parent, id, tipo_categoria, id_padre, estado, fecha) AS (SELECT categorias.nombre, categorias.descripcion, '/'::text AS text, NULL::text AS text, categorias.id, categorias.tipo_categoria, categorias.id_padre, categorias.estado, categorias.fecha FROM inventario.categorias WHERE ((categorias.id_padre)::text = '0'::text) UNION SELECT categorias.nombre, categorias.descripcion, ((parentpath.path || CASE parentpath.path WHEN '/'::text THEN ''::text ELSE '/'::text END) || (categorias.nombre)::text), parentpath.path, categorias.id, categorias.tipo_categoria, categorias.id_padre, categorias.estado, categorias.fecha FROM inventario.categorias, path parentpath WHERE ((categorias.id_padre)::text = (parentpath.id)::text)) SELECT path.nombre, path.descripcion, path.path, path.parent, path.id, path.tipo_categoria, path.id_padre, path.estado, path.fecha FROM path;


ALTER TABLE public.view_categorias OWNER TO postgres;

--
-- TOC entry 4039 (class 0 OID 0)
-- Dependencies: 296
-- Name: VIEW view_categorias; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON VIEW view_categorias IS 'crea la vista categorias, definida como arbol';


SET search_path = ventas, pg_catalog;

--
-- TOC entry 297 (class 1259 OID 33612)
-- Name: formas_pago; Type: TABLE; Schema: ventas; Owner: postgres; Tablespace: 
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


ALTER TABLE ventas.formas_pago OWNER TO postgres;

SET search_path = public, pg_catalog;

--
-- TOC entry 298 (class 1259 OID 33619)
-- Name: view_formas_pago; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW view_formas_pago AS
    WITH RECURSIVE path(nombre, descripcion, path, parent, id, codigo_sri, id_padre, estado, fecha) AS (SELECT formas_pago.nombre, formas_pago.descripcion, '/'::text AS text, NULL::text AS text, formas_pago.id, formas_pago.codigo_sri, formas_pago.id_padre, formas_pago.estado, formas_pago.fecha FROM ventas.formas_pago WHERE ((formas_pago.id_padre)::text = '0'::text) UNION SELECT formas_pago.nombre, formas_pago.descripcion, ((parentpath.path || CASE parentpath.path WHEN '/'::text THEN ''::text ELSE '/'::text END) || (formas_pago.nombre)::text), parentpath.path, formas_pago.id, formas_pago.codigo_sri, formas_pago.id_padre, formas_pago.estado, formas_pago.fecha FROM ventas.formas_pago, path parentpath WHERE ((formas_pago.id_padre)::text = (parentpath.id)::text)) SELECT path.nombre, path.descripcion, path.path, path.parent, path.id, path.codigo_sri, path.id_padre, path.estado, path.fecha FROM path;


ALTER TABLE public.view_formas_pago OWNER TO postgres;

--
-- TOC entry 4040 (class 0 OID 0)
-- Dependencies: 298
-- Name: VIEW view_formas_pago; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON VIEW view_formas_pago IS 'crea la vista formas de pago, definida como arbol';


--
-- TOC entry 299 (class 1259 OID 33624)
-- Name: view_ubicaciones; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW view_ubicaciones AS
    WITH RECURSIVE path(nombre, descripcion, path, parent, id, id_padre, estado, fecha) AS (SELECT ubicaciones.nombre, ubicaciones.descripcion, '/'::text AS text, NULL::text AS text, ubicaciones.id, ubicaciones.id_padre, ubicaciones.estado, ubicaciones.fecha FROM inventario.ubicaciones WHERE ((ubicaciones.id_padre)::text = '0'::text) UNION SELECT ubicaciones.nombre, ubicaciones.descripcion, ((parentpath.path || CASE parentpath.path WHEN '/'::text THEN ''::text ELSE '/'::text END) || (ubicaciones.nombre)::text), parentpath.path, ubicaciones.id, ubicaciones.id_padre, ubicaciones.estado, ubicaciones.fecha FROM inventario.ubicaciones, path parentpath WHERE ((ubicaciones.id_padre)::text = (parentpath.id)::text)) SELECT path.nombre, path.descripcion, path.path, path.parent, path.id, path.id_padre, path.estado, path.fecha FROM path;


ALTER TABLE public.view_ubicaciones OWNER TO postgres;

--
-- TOC entry 4041 (class 0 OID 0)
-- Dependencies: 299
-- Name: VIEW view_ubicaciones; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON VIEW view_ubicaciones IS 'crea la vista ubicaciones, definida como arbol';


SET search_path = talento_humano, pg_catalog;

--
-- TOC entry 300 (class 1259 OID 33629)
-- Name: cargos; Type: TABLE; Schema: talento_humano; Owner: postgres; Tablespace: 
--

CREATE TABLE cargos (
    id integer NOT NULL,
    nombre character varying(150) NOT NULL,
    estado character varying(5) NOT NULL,
    fecha timestamp without time zone DEFAULT now() NOT NULL,
    id_padre integer
);


ALTER TABLE talento_humano.cargos OWNER TO postgres;

--
-- TOC entry 301 (class 1259 OID 33633)
-- Name: cargos_id_seq; Type: SEQUENCE; Schema: talento_humano; Owner: postgres
--

CREATE SEQUENCE cargos_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE talento_humano.cargos_id_seq OWNER TO postgres;

--
-- TOC entry 4042 (class 0 OID 0)
-- Dependencies: 301
-- Name: cargos_id_seq; Type: SEQUENCE OWNED BY; Schema: talento_humano; Owner: postgres
--

ALTER SEQUENCE cargos_id_seq OWNED BY cargos.id;


--
-- TOC entry 302 (class 1259 OID 33635)
-- Name: empleados; Type: TABLE; Schema: talento_humano; Owner: postgres; Tablespace: 
--

CREATE TABLE empleados (
    id integer NOT NULL,
    id_persona integer NOT NULL,
    estado character varying(5) NOT NULL,
    fecha timestamp with time zone DEFAULT now() NOT NULL,
    id_usuario character varying(75),
    id_cargo integer
);


ALTER TABLE talento_humano.empleados OWNER TO postgres;

--
-- TOC entry 303 (class 1259 OID 33639)
-- Name: empleados_id_seq; Type: SEQUENCE; Schema: talento_humano; Owner: postgres
--

CREATE SEQUENCE empleados_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE talento_humano.empleados_id_seq OWNER TO postgres;

--
-- TOC entry 4043 (class 0 OID 0)
-- Dependencies: 303
-- Name: empleados_id_seq; Type: SEQUENCE OWNED BY; Schema: talento_humano; Owner: postgres
--

ALTER SEQUENCE empleados_id_seq OWNED BY empleados.id;


--
-- TOC entry 304 (class 1259 OID 33641)
-- Name: empleados_personas; Type: VIEW; Schema: talento_humano; Owner: postgres
--

CREATE VIEW empleados_personas AS
    SELECT empleados.id_persona, empleados.id AS id_empleados, personas_documentos_identificacion.numero_identificacion, personas.primer_nombre, personas.segundo_nombre, personas.primer_apellido, personas.segundo_apellido, personas_correo_electronico.correo_electronico FROM public.personas, public.personas_correo_electronico, public.personas_documentos_identificacion, empleados WHERE ((empleados.id_persona = personas.id) AND (personas_documentos_identificacion.id_persona = empleados.id_persona));


ALTER TABLE talento_humano.empleados_personas OWNER TO postgres;

--
-- TOC entry 305 (class 1259 OID 33645)
-- Name: jornadas_de_trabajo; Type: TABLE; Schema: talento_humano; Owner: postgres; Tablespace: 
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


ALTER TABLE talento_humano.jornadas_de_trabajo OWNER TO postgres;

--
-- TOC entry 4044 (class 0 OID 0)
-- Dependencies: 305
-- Name: COLUMN jornadas_de_trabajo.hora_descanso; Type: COMMENT; Schema: talento_humano; Owner: postgres
--

COMMENT ON COLUMN jornadas_de_trabajo.hora_descanso IS 'ingresar el dato en minutos';


--
-- TOC entry 306 (class 1259 OID 33651)
-- Name: jornadas_de_trabajo_id_seq; Type: SEQUENCE; Schema: talento_humano; Owner: postgres
--

CREATE SEQUENCE jornadas_de_trabajo_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE talento_humano.jornadas_de_trabajo_id_seq OWNER TO postgres;

--
-- TOC entry 4045 (class 0 OID 0)
-- Dependencies: 306
-- Name: jornadas_de_trabajo_id_seq; Type: SEQUENCE OWNED BY; Schema: talento_humano; Owner: postgres
--

ALTER SEQUENCE jornadas_de_trabajo_id_seq OWNED BY jornadas_de_trabajo.id;


--
-- TOC entry 307 (class 1259 OID 33653)
-- Name: tipos_contratos; Type: TABLE; Schema: talento_humano; Owner: postgres; Tablespace: 
--

CREATE TABLE tipos_contratos (
    id integer NOT NULL,
    nombre character varying(75) NOT NULL,
    descripcion character varying(2000) NOT NULL,
    estado character varying(5) NOT NULL,
    fecha timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE talento_humano.tipos_contratos OWNER TO postgres;

--
-- TOC entry 308 (class 1259 OID 33660)
-- Name: tipos_contratos_id_seq; Type: SEQUENCE; Schema: talento_humano; Owner: postgres
--

CREATE SEQUENCE tipos_contratos_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE talento_humano.tipos_contratos_id_seq OWNER TO postgres;

--
-- TOC entry 4046 (class 0 OID 0)
-- Dependencies: 308
-- Name: tipos_contratos_id_seq; Type: SEQUENCE OWNED BY; Schema: talento_humano; Owner: postgres
--

ALTER SEQUENCE tipos_contratos_id_seq OWNED BY tipos_contratos.id;


SET search_path = usuarios, pg_catalog;

--
-- TOC entry 309 (class 1259 OID 33662)
-- Name: tipo_usuario; Type: TABLE; Schema: usuarios; Owner: postgres; Tablespace: 
--

CREATE TABLE tipo_usuario (
    id integer NOT NULL,
    nombre character varying(75) NOT NULL,
    descripcion character varying(500) NOT NULL,
    estado character varying(5) NOT NULL,
    fecha time with time zone DEFAULT now() NOT NULL
);


ALTER TABLE usuarios.tipo_usuario OWNER TO postgres;

--
-- TOC entry 310 (class 1259 OID 33669)
-- Name: tipo_usuario_id_seq; Type: SEQUENCE; Schema: usuarios; Owner: postgres
--

CREATE SEQUENCE tipo_usuario_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE usuarios.tipo_usuario_id_seq OWNER TO postgres;

--
-- TOC entry 4047 (class 0 OID 0)
-- Dependencies: 310
-- Name: tipo_usuario_id_seq; Type: SEQUENCE OWNED BY; Schema: usuarios; Owner: postgres
--

ALTER SEQUENCE tipo_usuario_id_seq OWNED BY tipo_usuario.id;


--
-- TOC entry 311 (class 1259 OID 33671)
-- Name: usuarios; Type: TABLE; Schema: usuarios; Owner: postgres; Tablespace: 
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


ALTER TABLE usuarios.usuarios OWNER TO postgres;

--
-- TOC entry 4048 (class 0 OID 0)
-- Dependencies: 311
-- Name: COLUMN usuarios.id; Type: COMMENT; Schema: usuarios; Owner: postgres
--

COMMENT ON COLUMN usuarios.id IS 'id usuario del sistema Nexbook';


--
-- TOC entry 4049 (class 0 OID 0)
-- Dependencies: 311
-- Name: COLUMN usuarios.clave_clave; Type: COMMENT; Schema: usuarios; Owner: postgres
--

COMMENT ON COLUMN usuarios.clave_clave IS 'define la clave del usuario';


--
-- TOC entry 4050 (class 0 OID 0)
-- Dependencies: 311
-- Name: COLUMN usuarios.id_estado; Type: COMMENT; Schema: usuarios; Owner: postgres
--

COMMENT ON COLUMN usuarios.id_estado IS 'estado del usuario';


--
-- TOC entry 4051 (class 0 OID 0)
-- Dependencies: 311
-- Name: COLUMN usuarios.fecha_creacion; Type: COMMENT; Schema: usuarios; Owner: postgres
--

COMMENT ON COLUMN usuarios.fecha_creacion IS 'fecha en la que fue creado el usuario';


SET search_path = ventas, pg_catalog;

--
-- TOC entry 312 (class 1259 OID 33675)
-- Name: caja; Type: TABLE; Schema: ventas; Owner: postgres; Tablespace: 
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


ALTER TABLE ventas.caja OWNER TO postgres;

--
-- TOC entry 313 (class 1259 OID 33679)
-- Name: caja_id_seq; Type: SEQUENCE; Schema: ventas; Owner: postgres
--

CREATE SEQUENCE caja_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE ventas.caja_id_seq OWNER TO postgres;

--
-- TOC entry 4052 (class 0 OID 0)
-- Dependencies: 313
-- Name: caja_id_seq; Type: SEQUENCE OWNED BY; Schema: ventas; Owner: postgres
--

ALTER SEQUENCE caja_id_seq OWNED BY caja.id;


--
-- TOC entry 314 (class 1259 OID 33681)
-- Name: caja_usuario; Type: TABLE; Schema: ventas; Owner: postgres; Tablespace: 
--

CREATE TABLE caja_usuario (
    id_caja integer NOT NULL,
    id_usuario character varying(75) NOT NULL,
    id_empleado integer NOT NULL,
    estado character varying(5) NOT NULL,
    fecha date DEFAULT now() NOT NULL
);


ALTER TABLE ventas.caja_usuario OWNER TO postgres;

--
-- TOC entry 315 (class 1259 OID 33685)
-- Name: clave_factura; Type: TABLE; Schema: ventas; Owner: postgres; Tablespace: 
--

CREATE TABLE clave_factura (
    id integer NOT NULL,
    id_factura integer NOT NULL,
    clave_factura character varying(49) NOT NULL,
    estado character varying(5) NOT NULL,
    fecha timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE ventas.clave_factura OWNER TO postgres;

--
-- TOC entry 316 (class 1259 OID 33689)
-- Name: clave_factura_id_seq; Type: SEQUENCE; Schema: ventas; Owner: postgres
--

CREATE SEQUENCE clave_factura_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE ventas.clave_factura_id_seq OWNER TO postgres;

--
-- TOC entry 4053 (class 0 OID 0)
-- Dependencies: 316
-- Name: clave_factura_id_seq; Type: SEQUENCE OWNED BY; Schema: ventas; Owner: postgres
--

ALTER SEQUENCE clave_factura_id_seq OWNED BY clave_factura.id;


--
-- TOC entry 317 (class 1259 OID 33691)
-- Name: detalle_factura; Type: TABLE; Schema: ventas; Owner: postgres; Tablespace: 
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


ALTER TABLE ventas.detalle_factura OWNER TO postgres;

--
-- TOC entry 318 (class 1259 OID 33694)
-- Name: detalle_factura_id_seq; Type: SEQUENCE; Schema: ventas; Owner: postgres
--

CREATE SEQUENCE detalle_factura_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE ventas.detalle_factura_id_seq OWNER TO postgres;

--
-- TOC entry 4054 (class 0 OID 0)
-- Dependencies: 318
-- Name: detalle_factura_id_seq; Type: SEQUENCE OWNED BY; Schema: ventas; Owner: postgres
--

ALTER SEQUENCE detalle_factura_id_seq OWNED BY detalle_factura.id;


--
-- TOC entry 319 (class 1259 OID 33696)
-- Name: empleado_factura; Type: TABLE; Schema: ventas; Owner: postgres; Tablespace: 
--

CREATE TABLE empleado_factura (
    id_empleado integer NOT NULL,
    id_factura integer NOT NULL,
    fecha date DEFAULT now() NOT NULL
);


ALTER TABLE ventas.empleado_factura OWNER TO postgres;

--
-- TOC entry 320 (class 1259 OID 33700)
-- Name: facturas; Type: TABLE; Schema: ventas; Owner: postgres; Tablespace: 
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


ALTER TABLE ventas.facturas OWNER TO postgres;

--
-- TOC entry 321 (class 1259 OID 33707)
-- Name: facturas_id_seq; Type: SEQUENCE; Schema: ventas; Owner: postgres
--

CREATE SEQUENCE facturas_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE ventas.facturas_id_seq OWNER TO postgres;

--
-- TOC entry 4055 (class 0 OID 0)
-- Dependencies: 321
-- Name: facturas_id_seq; Type: SEQUENCE OWNED BY; Schema: ventas; Owner: postgres
--

ALTER SEQUENCE facturas_id_seq OWNED BY facturas.id;


--
-- TOC entry 322 (class 1259 OID 33709)
-- Name: formas_pago_facturas; Type: TABLE; Schema: ventas; Owner: postgres; Tablespace: 
--

CREATE TABLE formas_pago_facturas (
    id integer NOT NULL,
    id_factura integer NOT NULL,
    id_formas_pago integer NOT NULL
);


ALTER TABLE ventas.formas_pago_facturas OWNER TO postgres;

--
-- TOC entry 323 (class 1259 OID 33712)
-- Name: formas_pago_facturas_id_seq; Type: SEQUENCE; Schema: ventas; Owner: postgres
--

CREATE SEQUENCE formas_pago_facturas_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE ventas.formas_pago_facturas_id_seq OWNER TO postgres;

--
-- TOC entry 4056 (class 0 OID 0)
-- Dependencies: 323
-- Name: formas_pago_facturas_id_seq; Type: SEQUENCE OWNED BY; Schema: ventas; Owner: postgres
--

ALTER SEQUENCE formas_pago_facturas_id_seq OWNED BY formas_pago_facturas.id;


--
-- TOC entry 324 (class 1259 OID 33714)
-- Name: formas_pago_id_seq; Type: SEQUENCE; Schema: ventas; Owner: postgres
--

CREATE SEQUENCE formas_pago_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE ventas.formas_pago_id_seq OWNER TO postgres;

--
-- TOC entry 4057 (class 0 OID 0)
-- Dependencies: 324
-- Name: formas_pago_id_seq; Type: SEQUENCE OWNED BY; Schema: ventas; Owner: postgres
--

ALTER SEQUENCE formas_pago_id_seq OWNED BY formas_pago.id;


--
-- TOC entry 325 (class 1259 OID 33716)
-- Name: producto_descuento; Type: TABLE; Schema: ventas; Owner: postgres; Tablespace: 
--

CREATE TABLE producto_descuento (
    id integer NOT NULL,
    id_producto integer NOT NULL,
    id_catalogo integer NOT NULL,
    estado character varying(5) NOT NULL,
    fecha_fin_descuento timestamp with time zone NOT NULL,
    fecha_inicio_descuento timestamp with time zone NOT NULL
);


ALTER TABLE ventas.producto_descuento OWNER TO postgres;

--
-- TOC entry 326 (class 1259 OID 33719)
-- Name: producto_descuento_id_seq; Type: SEQUENCE; Schema: ventas; Owner: postgres
--

CREATE SEQUENCE producto_descuento_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE ventas.producto_descuento_id_seq OWNER TO postgres;

--
-- TOC entry 4058 (class 0 OID 0)
-- Dependencies: 326
-- Name: producto_descuento_id_seq; Type: SEQUENCE OWNED BY; Schema: ventas; Owner: postgres
--

ALTER SEQUENCE producto_descuento_id_seq OWNED BY producto_descuento.id;


SET search_path = "Taller_mecanico", pg_catalog;

--
-- TOC entry 3243 (class 2604 OID 33721)
-- Name: id; Type: DEFAULT; Schema: Taller_mecanico; Owner: postgres
--

ALTER TABLE ONLY "Aseguradora" ALTER COLUMN id SET DEFAULT nextval('"Aseguradora_id_seq"'::regclass);


SET search_path = administracion, pg_catalog;

--
-- TOC entry 3245 (class 2604 OID 33722)
-- Name: id; Type: DEFAULT; Schema: administracion; Owner: postgres
--

ALTER TABLE ONLY actividad_economica ALTER COLUMN id SET DEFAULT nextval('actividad_economica_id_seq'::regclass);


--
-- TOC entry 3249 (class 2604 OID 33723)
-- Name: id; Type: DEFAULT; Schema: administracion; Owner: postgres
--

ALTER TABLE ONLY empresas ALTER COLUMN id SET DEFAULT nextval('empresas_id_seq'::regclass);


--
-- TOC entry 3251 (class 2604 OID 33724)
-- Name: id; Type: DEFAULT; Schema: administracion; Owner: postgres
--

ALTER TABLE ONLY imagen_empresa ALTER COLUMN id SET DEFAULT nextval('imagen_empresa_id_seq'::regclass);


--
-- TOC entry 3254 (class 2604 OID 33725)
-- Name: id; Type: DEFAULT; Schema: administracion; Owner: postgres
--

ALTER TABLE ONLY sucursales ALTER COLUMN id SET DEFAULT nextval('sucursales_id_seq1'::regclass);


--
-- TOC entry 3256 (class 2604 OID 33726)
-- Name: id; Type: DEFAULT; Schema: administracion; Owner: postgres
--

ALTER TABLE ONLY tipo_accion_vista ALTER COLUMN id SET DEFAULT nextval('tipo_accion_vista_id_seq'::regclass);


--
-- TOC entry 3258 (class 2604 OID 33727)
-- Name: id; Type: DEFAULT; Schema: administracion; Owner: postgres
--

ALTER TABLE ONLY tipo_bienes_servicios ALTER COLUMN id SET DEFAULT nextval('tipo_bienes_servicios_id_seq'::regclass);


--
-- TOC entry 3260 (class 2604 OID 33728)
-- Name: id; Type: DEFAULT; Schema: administracion; Owner: postgres
--

ALTER TABLE ONLY tipo_empresa ALTER COLUMN id SET DEFAULT nextval('tipo_empresa_id_seq'::regclass);


--
-- TOC entry 3262 (class 2604 OID 33729)
-- Name: id; Type: DEFAULT; Schema: administracion; Owner: postgres
--

ALTER TABLE ONLY tipos_imagenes_empresas ALTER COLUMN id SET DEFAULT nextval('tipos_imagenes_productos_id_seq'::regclass);


--
-- TOC entry 3264 (class 2604 OID 33730)
-- Name: id; Type: DEFAULT; Schema: administracion; Owner: postgres
--

ALTER TABLE ONLY usuarios_privilegios ALTER COLUMN id SET DEFAULT nextval('usuarios_privilegios_id_seq'::regclass);


--
-- TOC entry 3267 (class 2604 OID 33731)
-- Name: id; Type: DEFAULT; Schema: administracion; Owner: postgres
--

ALTER TABLE ONLY vistas ALTER COLUMN id SET DEFAULT nextval('vistas_id_seq'::regclass);


SET search_path = auditoria, pg_catalog;

--
-- TOC entry 3268 (class 2604 OID 33732)
-- Name: id; Type: DEFAULT; Schema: auditoria; Owner: postgres
--

ALTER TABLE ONLY auditoria ALTER COLUMN id SET DEFAULT nextval('auditoria_id_seq'::regclass);


--
-- TOC entry 3270 (class 2604 OID 33733)
-- Name: id; Type: DEFAULT; Schema: auditoria; Owner: postgres
--

ALTER TABLE ONLY ingresos_usuarios ALTER COLUMN id SET DEFAULT nextval('ingresos_usuarios_id_seq'::regclass);


SET search_path = contabilidad, pg_catalog;

--
-- TOC entry 3275 (class 2604 OID 33734)
-- Name: id; Type: DEFAULT; Schema: contabilidad; Owner: postgres
--

ALTER TABLE ONLY ambitos_impuestos ALTER COLUMN id SET DEFAULT nextval('ambitos_impuestos_id_seq'::regclass);


--
-- TOC entry 3277 (class 2604 OID 33735)
-- Name: id; Type: DEFAULT; Schema: contabilidad; Owner: postgres
--

ALTER TABLE ONLY asientos_contables_diario ALTER COLUMN id SET DEFAULT nextval('asientos_contables_diario_id_seq'::regclass);


--
-- TOC entry 3279 (class 2604 OID 33736)
-- Name: id; Type: DEFAULT; Schema: contabilidad; Owner: postgres
--

ALTER TABLE ONLY bancos ALTER COLUMN id SET DEFAULT nextval('bancos_id_seq'::regclass);


--
-- TOC entry 3281 (class 2604 OID 33737)
-- Name: id; Type: DEFAULT; Schema: contabilidad; Owner: postgres
--

ALTER TABLE ONLY cuentas_contables ALTER COLUMN id SET DEFAULT nextval('cuentas_contables_id_seq'::regclass);


--
-- TOC entry 3285 (class 2604 OID 33738)
-- Name: id; Type: DEFAULT; Schema: contabilidad; Owner: postgres
--

ALTER TABLE ONLY finaciaminto ALTER COLUMN id SET DEFAULT nextval('finaciaminto_id_seq'::regclass);


--
-- TOC entry 3287 (class 2604 OID 33739)
-- Name: id; Type: DEFAULT; Schema: contabilidad; Owner: postgres
--

ALTER TABLE ONLY gasto_mes_repositorio ALTER COLUMN id SET DEFAULT nextval('gasto_mes_repositorio_id_seq'::regclass);


--
-- TOC entry 3289 (class 2604 OID 33740)
-- Name: id; Type: DEFAULT; Schema: contabilidad; Owner: postgres
--

ALTER TABLE ONLY gastos_impuestos_renta_deduccion ALTER COLUMN id SET DEFAULT nextval('gastos_impuestos_renta_deduccion_id_seq'::regclass);


--
-- TOC entry 3290 (class 2604 OID 33741)
-- Name: id; Type: DEFAULT; Schema: contabilidad; Owner: postgres
--

ALTER TABLE ONLY grupo_impuestos ALTER COLUMN id SET DEFAULT nextval('grupo_impuestos_id_seq'::regclass);


--
-- TOC entry 3293 (class 2604 OID 33742)
-- Name: id; Type: DEFAULT; Schema: contabilidad; Owner: postgres
--

ALTER TABLE ONLY impuestos ALTER COLUMN id SET DEFAULT nextval('impuestos_id_seq'::regclass);


--
-- TOC entry 3273 (class 2604 OID 33743)
-- Name: id; Type: DEFAULT; Schema: contabilidad; Owner: postgres
--

ALTER TABLE ONLY plazos_credito ALTER COLUMN id SET DEFAULT nextval('"Plazos_credito_id_seq"'::regclass);


--
-- TOC entry 3295 (class 2604 OID 33744)
-- Name: id_factura; Type: DEFAULT; Schema: contabilidad; Owner: postgres
--

ALTER TABLE ONLY repositorio_facturas ALTER COLUMN id_factura SET DEFAULT nextval('repositorio_facturas_id_factura_seq'::regclass);


--
-- TOC entry 3283 (class 2604 OID 33745)
-- Name: id; Type: DEFAULT; Schema: contabilidad; Owner: postgres
--

ALTER TABLE ONLY repositorio_facturas_correo ALTER COLUMN id SET DEFAULT nextval('facturas_correo_id_seq'::regclass);


--
-- TOC entry 3297 (class 2604 OID 33746)
-- Name: id_factura_r; Type: DEFAULT; Schema: contabilidad; Owner: postgres
--

ALTER TABLE ONLY repositorio_facturas_rechazadas ALTER COLUMN id_factura_r SET DEFAULT nextval('repositorio_facturas_rechazadas_id_factura_r_seq'::regclass);


--
-- TOC entry 3299 (class 2604 OID 33747)
-- Name: id; Type: DEFAULT; Schema: contabilidad; Owner: postgres
--

ALTER TABLE ONLY rol_pagos_empleados ALTER COLUMN id SET DEFAULT nextval('rol_pagos_empleados_id_seq'::regclass);


--
-- TOC entry 3304 (class 2604 OID 33748)
-- Name: id; Type: DEFAULT; Schema: contabilidad; Owner: postgres
--

ALTER TABLE ONLY tipo_impuestos ALTER COLUMN id SET DEFAULT nextval('tipo_impuestos_id_seq'::regclass);


--
-- TOC entry 3301 (class 2604 OID 33749)
-- Name: id; Type: DEFAULT; Schema: contabilidad; Owner: postgres
--

ALTER TABLE ONLY tipos_cuentas_contables ALTER COLUMN id SET DEFAULT nextval('tipo_cuenta_contable_id_seq'::regclass);


--
-- TOC entry 3306 (class 2604 OID 33750)
-- Name: id; Type: DEFAULT; Schema: contabilidad; Owner: postgres
--

ALTER TABLE ONLY tipos_gastos_personales ALTER COLUMN id SET DEFAULT nextval('tipos_gastos_personales_id_seq'::regclass);


SET search_path = inventario, pg_catalog;

--
-- TOC entry 3308 (class 2604 OID 33751)
-- Name: id; Type: DEFAULT; Schema: inventario; Owner: postgres
--

ALTER TABLE ONLY bodegas ALTER COLUMN id SET DEFAULT nextval('bodegas_id_seq'::regclass);


--
-- TOC entry 3309 (class 2604 OID 33752)
-- Name: id; Type: DEFAULT; Schema: inventario; Owner: postgres
--

ALTER TABLE ONLY catalogos ALTER COLUMN id SET DEFAULT nextval('catalogos_id_seq'::regclass);


--
-- TOC entry 3312 (class 2604 OID 33753)
-- Name: id; Type: DEFAULT; Schema: inventario; Owner: postgres
--

ALTER TABLE ONLY categorias ALTER COLUMN id SET DEFAULT nextval('categorias_id_seq'::regclass);


--
-- TOC entry 3313 (class 2604 OID 33754)
-- Name: id; Type: DEFAULT; Schema: inventario; Owner: postgres
--

ALTER TABLE ONLY descripcion_producto ALTER COLUMN id SET DEFAULT nextval('descripcion_producto_id_seq'::regclass);


--
-- TOC entry 3315 (class 2604 OID 33755)
-- Name: id; Type: DEFAULT; Schema: inventario; Owner: postgres
--

ALTER TABLE ONLY estado_descriptivo ALTER COLUMN id SET DEFAULT nextval('estado_descriptivo_id_seq'::regclass);


--
-- TOC entry 3317 (class 2604 OID 33756)
-- Name: id; Type: DEFAULT; Schema: inventario; Owner: postgres
--

ALTER TABLE ONLY garantias ALTER COLUMN id SET DEFAULT nextval('garantias_id_seq'::regclass);


--
-- TOC entry 3320 (class 2604 OID 33757)
-- Name: id; Type: DEFAULT; Schema: inventario; Owner: postgres
--

ALTER TABLE ONLY manejo_presios ALTER COLUMN id SET DEFAULT nextval('manejo_presios_id_seq'::regclass);


--
-- TOC entry 3322 (class 2604 OID 33758)
-- Name: id; Type: DEFAULT; Schema: inventario; Owner: postgres
--

ALTER TABLE ONLY marcas ALTER COLUMN id SET DEFAULT nextval('marcas_id_seq'::regclass);


--
-- TOC entry 3324 (class 2604 OID 33759)
-- Name: id; Type: DEFAULT; Schema: inventario; Owner: postgres
--

ALTER TABLE ONLY modelos ALTER COLUMN id SET DEFAULT nextval('modelos_id_seq'::regclass);


--
-- TOC entry 3325 (class 2604 OID 33760)
-- Name: id; Type: DEFAULT; Schema: inventario; Owner: postgres
--

ALTER TABLE ONLY productos ALTER COLUMN id SET DEFAULT nextval('productos_id_seq'::regclass);


--
-- TOC entry 3326 (class 2604 OID 33761)
-- Name: id; Type: DEFAULT; Schema: inventario; Owner: postgres
--

ALTER TABLE ONLY productos_impuestos ALTER COLUMN id SET DEFAULT nextval('productos_impuestos_id_seq'::regclass);


--
-- TOC entry 3327 (class 2604 OID 33762)
-- Name: id; Type: DEFAULT; Schema: inventario; Owner: postgres
--

ALTER TABLE ONLY proveedores ALTER COLUMN id SET DEFAULT nextval('proveedores_id_seq'::regclass);


--
-- TOC entry 3329 (class 2604 OID 33763)
-- Name: id; Type: DEFAULT; Schema: inventario; Owner: postgres
--

ALTER TABLE ONLY tipo_consumo ALTER COLUMN id SET DEFAULT nextval('tipo_consumo_id_seq'::regclass);


--
-- TOC entry 3331 (class 2604 OID 33764)
-- Name: id; Type: DEFAULT; Schema: inventario; Owner: postgres
--

ALTER TABLE ONLY tipos_catalogos ALTER COLUMN id SET DEFAULT nextval('tipos_catalogos_id_seq'::regclass);


--
-- TOC entry 3333 (class 2604 OID 33765)
-- Name: id; Type: DEFAULT; Schema: inventario; Owner: postgres
--

ALTER TABLE ONLY tipos_categorias ALTER COLUMN id SET DEFAULT nextval('tipos_categorias_id_seq'::regclass);


--
-- TOC entry 3335 (class 2604 OID 33766)
-- Name: id; Type: DEFAULT; Schema: inventario; Owner: postgres
--

ALTER TABLE ONLY tipos_garantias ALTER COLUMN id SET DEFAULT nextval('tipos_garantias_id_seq'::regclass);


--
-- TOC entry 3337 (class 2604 OID 33767)
-- Name: id; Type: DEFAULT; Schema: inventario; Owner: postgres
--

ALTER TABLE ONLY tipos_imagenes_productos ALTER COLUMN id SET DEFAULT nextval('tipos_imagenes_productos_id_seq'::regclass);


--
-- TOC entry 3339 (class 2604 OID 33768)
-- Name: id; Type: DEFAULT; Schema: inventario; Owner: postgres
--

ALTER TABLE ONLY tipos_productos ALTER COLUMN id SET DEFAULT nextval('tipos_productos_id_seq'::regclass);


--
-- TOC entry 3341 (class 2604 OID 33769)
-- Name: id; Type: DEFAULT; Schema: inventario; Owner: postgres
--

ALTER TABLE ONLY tipos_tipo_consumo ALTER COLUMN id SET DEFAULT nextval('tipos_tipo_consumo_id_seq'::regclass);


--
-- TOC entry 3344 (class 2604 OID 33770)
-- Name: id; Type: DEFAULT; Schema: inventario; Owner: postgres
--

ALTER TABLE ONLY ubicaciones ALTER COLUMN id SET DEFAULT nextval('ubicaciones_id_seq'::regclass);


SET search_path = public, pg_catalog;

--
-- TOC entry 3347 (class 2604 OID 33771)
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY operadoras_telefonicas ALTER COLUMN id SET DEFAULT nextval('operadoras_telefonicas_id_seq'::regclass);


--
-- TOC entry 3348 (class 2604 OID 33772)
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY personas ALTER COLUMN id SET DEFAULT nextval('personas_id_seq'::regclass);


--
-- TOC entry 3350 (class 2604 OID 33773)
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY personas_correo_electronico ALTER COLUMN id SET DEFAULT nextval('personas_correo_electronico_id_seq'::regclass);


--
-- TOC entry 3352 (class 2604 OID 33774)
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY personas_documentos_identificacion ALTER COLUMN id SET DEFAULT nextval('personas_documentos_identificacion_id_seq'::regclass);


--
-- TOC entry 3354 (class 2604 OID 33775)
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY telefonos_personas ALTER COLUMN id SET DEFAULT nextval('telefonos_personas_id_seq'::regclass);


--
-- TOC entry 3356 (class 2604 OID 33776)
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY tipo_documento_identificacion ALTER COLUMN id SET DEFAULT nextval('tipo_documento_identificaion_id_seq'::regclass);


SET search_path = talento_humano, pg_catalog;

--
-- TOC entry 3360 (class 2604 OID 33777)
-- Name: id; Type: DEFAULT; Schema: talento_humano; Owner: postgres
--

ALTER TABLE ONLY cargos ALTER COLUMN id SET DEFAULT nextval('cargos_id_seq'::regclass);


--
-- TOC entry 3362 (class 2604 OID 33778)
-- Name: id; Type: DEFAULT; Schema: talento_humano; Owner: postgres
--

ALTER TABLE ONLY empleados ALTER COLUMN id SET DEFAULT nextval('empleados_id_seq'::regclass);


--
-- TOC entry 3363 (class 2604 OID 33779)
-- Name: id; Type: DEFAULT; Schema: talento_humano; Owner: postgres
--

ALTER TABLE ONLY jornadas_de_trabajo ALTER COLUMN id SET DEFAULT nextval('jornadas_de_trabajo_id_seq'::regclass);


--
-- TOC entry 3365 (class 2604 OID 33780)
-- Name: id; Type: DEFAULT; Schema: talento_humano; Owner: postgres
--

ALTER TABLE ONLY tipos_contratos ALTER COLUMN id SET DEFAULT nextval('tipos_contratos_id_seq'::regclass);


SET search_path = usuarios, pg_catalog;

--
-- TOC entry 3367 (class 2604 OID 33781)
-- Name: id; Type: DEFAULT; Schema: usuarios; Owner: postgres
--

ALTER TABLE ONLY tipo_usuario ALTER COLUMN id SET DEFAULT nextval('tipo_usuario_id_seq'::regclass);


SET search_path = ventas, pg_catalog;

--
-- TOC entry 3370 (class 2604 OID 33782)
-- Name: id; Type: DEFAULT; Schema: ventas; Owner: postgres
--

ALTER TABLE ONLY caja ALTER COLUMN id SET DEFAULT nextval('caja_id_seq'::regclass);


--
-- TOC entry 3373 (class 2604 OID 33783)
-- Name: id; Type: DEFAULT; Schema: ventas; Owner: postgres
--

ALTER TABLE ONLY clave_factura ALTER COLUMN id SET DEFAULT nextval('clave_factura_id_seq'::regclass);


--
-- TOC entry 3374 (class 2604 OID 33784)
-- Name: id; Type: DEFAULT; Schema: ventas; Owner: postgres
--

ALTER TABLE ONLY detalle_factura ALTER COLUMN id SET DEFAULT nextval('detalle_factura_id_seq'::regclass);


--
-- TOC entry 3377 (class 2604 OID 33785)
-- Name: id; Type: DEFAULT; Schema: ventas; Owner: postgres
--

ALTER TABLE ONLY facturas ALTER COLUMN id SET DEFAULT nextval('facturas_id_seq'::regclass);


--
-- TOC entry 3358 (class 2604 OID 33786)
-- Name: id; Type: DEFAULT; Schema: ventas; Owner: postgres
--

ALTER TABLE ONLY formas_pago ALTER COLUMN id SET DEFAULT nextval('formas_pago_id_seq'::regclass);


--
-- TOC entry 3378 (class 2604 OID 33787)
-- Name: id; Type: DEFAULT; Schema: ventas; Owner: postgres
--

ALTER TABLE ONLY formas_pago_facturas ALTER COLUMN id SET DEFAULT nextval('formas_pago_facturas_id_seq'::regclass);


--
-- TOC entry 3379 (class 2604 OID 33788)
-- Name: id; Type: DEFAULT; Schema: ventas; Owner: postgres
--

ALTER TABLE ONLY producto_descuento ALTER COLUMN id SET DEFAULT nextval('producto_descuento_id_seq'::regclass);


SET search_path = "Taller_mecanico", pg_catalog;

--
-- TOC entry 3796 (class 0 OID 33131)
-- Dependencies: 177
-- Data for Name: Aseguradora; Type: TABLE DATA; Schema: Taller_mecanico; Owner: postgres
--

COPY "Aseguradora" (id, contacto, id_empresa) FROM stdin;
\.


--
-- TOC entry 4059 (class 0 OID 0)
-- Dependencies: 178
-- Name: Aseguradora_id_seq; Type: SEQUENCE SET; Schema: Taller_mecanico; Owner: postgres
--

SELECT pg_catalog.setval('"Aseguradora_id_seq"', 1, false);


SET search_path = administracion, pg_catalog;

--
-- TOC entry 3798 (class 0 OID 33139)
-- Dependencies: 179
-- Data for Name: actividad_economica; Type: TABLE DATA; Schema: administracion; Owner: postgres
--

COPY actividad_economica (id, nombre, descripcion, id_tipo_bienes_servicios, estado, fecha, imagen) FROM stdin;
\.


--
-- TOC entry 4060 (class 0 OID 0)
-- Dependencies: 180
-- Name: actividad_economica_id_seq; Type: SEQUENCE SET; Schema: administracion; Owner: postgres
--

SELECT pg_catalog.setval('actividad_economica_id_seq', 1, false);


--
-- TOC entry 3800 (class 0 OID 33148)
-- Dependencies: 181
-- Data for Name: clientes; Type: TABLE DATA; Schema: administracion; Owner: postgres
--

COPY clientes (id, tipo_cliente, id_cliente, id_tipo_documento, fecha, estado) FROM stdin;
\.


--
-- TOC entry 3801 (class 0 OID 33155)
-- Dependencies: 182
-- Data for Name: empresas; Type: TABLE DATA; Schema: administracion; Owner: postgres
--

COPY empresas (id, razon_social, actividad_economica, ruc_ci, nombre_comercial, tipo_persona, id_estado, fecha, tipo_empresa) FROM stdin;
\.


--
-- TOC entry 4061 (class 0 OID 0)
-- Dependencies: 183
-- Name: empresas_id_seq; Type: SEQUENCE SET; Schema: administracion; Owner: postgres
--

SELECT pg_catalog.setval('empresas_id_seq', 1, false);


--
-- TOC entry 3803 (class 0 OID 33165)
-- Dependencies: 184
-- Data for Name: imagen_empresa; Type: TABLE DATA; Schema: administracion; Owner: postgres
--

COPY imagen_empresa (id, sucursal, direccion_imagen_empresa, direccion_imagen_recorte, estado, fecha, tipo_imagen) FROM stdin;
\.


--
-- TOC entry 4062 (class 0 OID 0)
-- Dependencies: 185
-- Name: imagen_empresa_id_seq; Type: SEQUENCE SET; Schema: administracion; Owner: postgres
--

SELECT pg_catalog.setval('imagen_empresa_id_seq', 1, false);


--
-- TOC entry 3805 (class 0 OID 33174)
-- Dependencies: 186
-- Data for Name: sucursales; Type: TABLE DATA; Schema: administracion; Owner: postgres
--

COPY sucursales (id, nombre, responsable, datos_empresariales, localizacion_sucursal, datos_adiconales, codigo_sri, giro_negocio, actividad_economica, id_empresa) FROM stdin;
\.


--
-- TOC entry 4063 (class 0 OID 0)
-- Dependencies: 187
-- Name: sucursales_id_seq; Type: SEQUENCE SET; Schema: administracion; Owner: postgres
--

SELECT pg_catalog.setval('sucursales_id_seq', 1, false);


--
-- TOC entry 4064 (class 0 OID 0)
-- Dependencies: 188
-- Name: sucursales_id_seq1; Type: SEQUENCE SET; Schema: administracion; Owner: postgres
--

SELECT pg_catalog.setval('sucursales_id_seq1', 1, false);


--
-- TOC entry 3808 (class 0 OID 33186)
-- Dependencies: 189
-- Data for Name: tipo_accion_vista; Type: TABLE DATA; Schema: administracion; Owner: postgres
--

COPY tipo_accion_vista (id, accion_ver, accion_guardar, accion_modificar, estado, fecha) FROM stdin;
1	t	t	t	A	2017-10-31 10:46:42.308461
\.


--
-- TOC entry 4065 (class 0 OID 0)
-- Dependencies: 190
-- Name: tipo_accion_vista_id_seq; Type: SEQUENCE SET; Schema: administracion; Owner: postgres
--

SELECT pg_catalog.setval('tipo_accion_vista_id_seq', 1, true);


--
-- TOC entry 3810 (class 0 OID 33192)
-- Dependencies: 191
-- Data for Name: tipo_bienes_servicios; Type: TABLE DATA; Schema: administracion; Owner: postgres
--

COPY tipo_bienes_servicios (id, nombre, descripcion, fecha, estado, id_prestacion) FROM stdin;
0	Falta definir	solicita definir tipo de giro de negocio	2017-03-21 15:53:16.112294	A	\N
\.


--
-- TOC entry 4066 (class 0 OID 0)
-- Dependencies: 192
-- Name: tipo_bienes_servicios_id_seq; Type: SEQUENCE SET; Schema: administracion; Owner: postgres
--

SELECT pg_catalog.setval('tipo_bienes_servicios_id_seq', 6, true);


--
-- TOC entry 3812 (class 0 OID 33201)
-- Dependencies: 193
-- Data for Name: tipo_empresa; Type: TABLE DATA; Schema: administracion; Owner: postgres
--

COPY tipo_empresa (id, nombre, descripcion, estado, fecha) FROM stdin;
0	Propia                                            	la empresa propietaria de la BDD	A	2017-04-17 15:05:22.37072
1	Cliente                                           	empresa cliente	A	2017-04-17 15:05:41.539454
\.


--
-- TOC entry 4067 (class 0 OID 0)
-- Dependencies: 194
-- Name: tipo_empresa_id_seq; Type: SEQUENCE SET; Schema: administracion; Owner: postgres
--

SELECT pg_catalog.setval('tipo_empresa_id_seq', 3, true);


--
-- TOC entry 3814 (class 0 OID 33210)
-- Dependencies: 195
-- Data for Name: tipos_imagenes_empresas; Type: TABLE DATA; Schema: administracion; Owner: postgres
--

COPY tipos_imagenes_empresas (id, nombre, estado, fecha) FROM stdin;
1	PORTADA	A	2017-05-18 10:25:13.384762-05
2	PERFIL	A	2017-05-18 10:25:29.059976-05
3	FRONTAL	A	2017-05-18 10:25:40.058242-05
0	PENDIENTE	A	2017-05-18 10:25:50.510283-05
\.


--
-- TOC entry 4068 (class 0 OID 0)
-- Dependencies: 196
-- Name: tipos_imagenes_productos_id_seq; Type: SEQUENCE SET; Schema: administracion; Owner: postgres
--

SELECT pg_catalog.setval('tipos_imagenes_productos_id_seq', 3, true);


--
-- TOC entry 3816 (class 0 OID 33216)
-- Dependencies: 197
-- Data for Name: usuarios_privilegios; Type: TABLE DATA; Schema: administracion; Owner: postgres
--

COPY usuarios_privilegios (id, estado, fecha, id_vista, id_tipo_usuario, id_tipo_accion_vistas) FROM stdin;
\.


--
-- TOC entry 4069 (class 0 OID 0)
-- Dependencies: 198
-- Name: usuarios_privilegios_id_seq; Type: SEQUENCE SET; Schema: administracion; Owner: postgres
--

SELECT pg_catalog.setval('usuarios_privilegios_id_seq', 1, false);


--
-- TOC entry 3818 (class 0 OID 33222)
-- Dependencies: 199
-- Data for Name: vistas; Type: TABLE DATA; Schema: administracion; Owner: postgres
--

COPY vistas (id, nombre, path, url, personalizacion, estado, id_padre, nivel_arbol, template_, controller_, fecha) FROM stdin;
\.


--
-- TOC entry 4070 (class 0 OID 0)
-- Dependencies: 200
-- Name: vistas_id_seq; Type: SEQUENCE SET; Schema: administracion; Owner: postgres
--

SELECT pg_catalog.setval('vistas_id_seq', 1, false);


SET search_path = auditoria, pg_catalog;

--
-- TOC entry 3820 (class 0 OID 33232)
-- Dependencies: 201
-- Data for Name: auditoria; Type: TABLE DATA; Schema: auditoria; Owner: postgres
--

COPY auditoria (id, tabla_afectada, operacion, variable_anterior, variable_nueva, fecha, usuario) FROM stdin;
3	cargos                                       	U	(1,Administrador,,"2017-05-18 15:28:06.929823",)	(1,Administrador,A,"2017-05-18 15:28:06.929823",)	2017-05-18 15:28:39.964714	postgres                                     
4	cargos                                       	U	(1,Administrador,A,"2017-05-18 15:28:06.929823",)	(1,Administrador,A,"2017-05-18 15:28:06.929823",0)	2017-05-18 15:29:04.993192	postgres                                     
5	usuarios                                     	I	\N	("usuario prueba 1",prueba,123455,A,,t,1)	2017-06-05 12:45:38.91663	postgres                                     
6	empleados                                    	I	\N	(6,1,A,"2017-06-05 12:46:35.094297-05","usuario prueba 1",)	2017-06-05 12:46:35.094297	postgres                                     
7	empleados                                    	U	(6,1,A,"2017-06-05 12:46:35.094297-05","usuario prueba 1",)	(1,1,A,"2017-06-05 12:46:35.094297-05","usuario prueba 1",)	2017-06-05 12:46:52.813799	postgres                                     
8	tipo_accion_vista                            	I	\N	(1,t,t,t,A,"2017-10-31 10:46:42.308461")	2017-10-31 10:46:42.308461	postgres                                     
\.


--
-- TOC entry 4071 (class 0 OID 0)
-- Dependencies: 202
-- Name: auditoria_id_seq; Type: SEQUENCE SET; Schema: auditoria; Owner: postgres
--

SELECT pg_catalog.setval('auditoria_id_seq', 8, true);


--
-- TOC entry 3822 (class 0 OID 33240)
-- Dependencies: 203
-- Data for Name: ingresos_usuarios; Type: TABLE DATA; Schema: auditoria; Owner: postgres
--

COPY ingresos_usuarios (id, usuario, informacion_servidor, fecha, ip_acceso) FROM stdin;
\.


--
-- TOC entry 4072 (class 0 OID 0)
-- Dependencies: 204
-- Name: ingresos_usuarios_id_seq; Type: SEQUENCE SET; Schema: auditoria; Owner: postgres
--

SELECT pg_catalog.setval('ingresos_usuarios_id_seq', 2, true);


SET search_path = contabilidad, pg_catalog;

--
-- TOC entry 4073 (class 0 OID 0)
-- Dependencies: 206
-- Name: Plazos_credito_id_seq; Type: SEQUENCE SET; Schema: contabilidad; Owner: postgres
--

SELECT pg_catalog.setval('"Plazos_credito_id_seq"', 1, false);


--
-- TOC entry 3826 (class 0 OID 33256)
-- Dependencies: 207
-- Data for Name: ambitos_impuestos; Type: TABLE DATA; Schema: contabilidad; Owner: postgres
--

COPY ambitos_impuestos (id, nombre, estado, fecha) FROM stdin;
4	VENTAS	A	2017-01-13
5	COMPRAS	A	2017-01-13
\.


--
-- TOC entry 4074 (class 0 OID 0)
-- Dependencies: 208
-- Name: ambitos_impuestos_id_seq; Type: SEQUENCE SET; Schema: contabilidad; Owner: postgres
--

SELECT pg_catalog.setval('ambitos_impuestos_id_seq', 5, true);


--
-- TOC entry 3828 (class 0 OID 33262)
-- Dependencies: 209
-- Data for Name: asientos_contables_diario; Type: TABLE DATA; Schema: contabilidad; Owner: postgres
--

COPY asientos_contables_diario (id, id_tipo_cuenta_contable, referencia_asiento, debe, haber, fecha, estado) FROM stdin;
\.


--
-- TOC entry 4075 (class 0 OID 0)
-- Dependencies: 210
-- Name: asientos_contables_diario_id_seq; Type: SEQUENCE SET; Schema: contabilidad; Owner: postgres
--

SELECT pg_catalog.setval('asientos_contables_diario_id_seq', 1, false);


--
-- TOC entry 3830 (class 0 OID 33268)
-- Dependencies: 211
-- Data for Name: bancos; Type: TABLE DATA; Schema: contabilidad; Owner: postgres
--

COPY bancos (id, nombre_banco, numero_cuanta, titular_cuenta, direccion_sucursal_banco, estado, fecha) FROM stdin;
\.


--
-- TOC entry 4076 (class 0 OID 0)
-- Dependencies: 212
-- Name: bancos_id_seq; Type: SEQUENCE SET; Schema: contabilidad; Owner: postgres
--

SELECT pg_catalog.setval('bancos_id_seq', 1, false);


--
-- TOC entry 3832 (class 0 OID 33277)
-- Dependencies: 213
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
-- TOC entry 4077 (class 0 OID 0)
-- Dependencies: 214
-- Name: cuentas_contables_id_seq; Type: SEQUENCE SET; Schema: contabilidad; Owner: postgres
--

SELECT pg_catalog.setval('cuentas_contables_id_seq', 11, true);


--
-- TOC entry 4078 (class 0 OID 0)
-- Dependencies: 216
-- Name: facturas_correo_id_seq; Type: SEQUENCE SET; Schema: contabilidad; Owner: postgres
--

SELECT pg_catalog.setval('facturas_correo_id_seq', 1, false);


--
-- TOC entry 3836 (class 0 OID 33295)
-- Dependencies: 217
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
-- TOC entry 3837 (class 0 OID 33298)
-- Dependencies: 218
-- Data for Name: finaciaminto; Type: TABLE DATA; Schema: contabilidad; Owner: postgres
--

COPY finaciaminto (id, id_factura, total_factura, pago_parcial, numero_cuotas, id_plazos_credito, fecha_prestamo, subtotal_sin_iva, subtotal_iva, iva, fecha_vencimiento, estado_pago, porcentaje_sin_iva, porcentaje_iva, porcentaje_con_iva) FROM stdin;
\.


--
-- TOC entry 4079 (class 0 OID 0)
-- Dependencies: 219
-- Name: finaciaminto_id_seq; Type: SEQUENCE SET; Schema: contabilidad; Owner: postgres
--

SELECT pg_catalog.setval('finaciaminto_id_seq', 1, false);


--
-- TOC entry 3839 (class 0 OID 33304)
-- Dependencies: 220
-- Data for Name: gasto_mes_repositorio; Type: TABLE DATA; Schema: contabilidad; Owner: postgres
--

COPY gasto_mes_repositorio (id, id_factura, id_tipo_gasto, total_gasto, fecha, estado_revicion) FROM stdin;
\.


--
-- TOC entry 4080 (class 0 OID 0)
-- Dependencies: 221
-- Name: gasto_mes_repositorio_id_seq; Type: SEQUENCE SET; Schema: contabilidad; Owner: postgres
--

SELECT pg_catalog.setval('gasto_mes_repositorio_id_seq', 1, false);


--
-- TOC entry 3841 (class 0 OID 33310)
-- Dependencies: 222
-- Data for Name: gastos_impuestos_renta_deduccion; Type: TABLE DATA; Schema: contabilidad; Owner: postgres
--

COPY gastos_impuestos_renta_deduccion (id, id_factura, id_tipo_gasto_personal, valor_acumular, estado, fecha) FROM stdin;
\.


--
-- TOC entry 4081 (class 0 OID 0)
-- Dependencies: 223
-- Name: gastos_impuestos_renta_deduccion_id_seq; Type: SEQUENCE SET; Schema: contabilidad; Owner: postgres
--

SELECT pg_catalog.setval('gastos_impuestos_renta_deduccion_id_seq', 1, false);


--
-- TOC entry 3843 (class 0 OID 33316)
-- Dependencies: 224
-- Data for Name: genealogia_impuestos; Type: TABLE DATA; Schema: contabilidad; Owner: postgres
--

COPY genealogia_impuestos (id_impuesto_padre, id_impuesto_hijo) FROM stdin;
\.


--
-- TOC entry 3844 (class 0 OID 33319)
-- Dependencies: 225
-- Data for Name: grupo_impuestos; Type: TABLE DATA; Schema: contabilidad; Owner: postgres
--

COPY grupo_impuestos (id, nombre, estado, fecha) FROM stdin;
\.


--
-- TOC entry 4082 (class 0 OID 0)
-- Dependencies: 226
-- Name: grupo_impuestos_id_seq; Type: SEQUENCE SET; Schema: contabilidad; Owner: postgres
--

SELECT pg_catalog.setval('grupo_impuestos_id_seq', 1, false);


--
-- TOC entry 3846 (class 0 OID 33324)
-- Dependencies: 227
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
-- TOC entry 4083 (class 0 OID 0)
-- Dependencies: 228
-- Name: impuestos_id_seq; Type: SEQUENCE SET; Schema: contabilidad; Owner: postgres
--

SELECT pg_catalog.setval('impuestos_id_seq', 9, true);


--
-- TOC entry 3824 (class 0 OID 33249)
-- Dependencies: 205
-- Data for Name: plazos_credito; Type: TABLE DATA; Schema: contabilidad; Owner: postgres
--

COPY plazos_credito (id, nombre, dias_credito, estado, fecha) FROM stdin;
\.


--
-- TOC entry 3848 (class 0 OID 33335)
-- Dependencies: 229
-- Data for Name: repositorio_facturas; Type: TABLE DATA; Schema: contabilidad; Owner: postgres
--

COPY repositorio_facturas (id_factura, num_factura, nombre_comercial, clave_acceso, ruc_prov, tipo_doc, total, contenido_fac, created_at, id_sucursal, fecha_emision, subtotal_12, subtotal_0, subtotal_no_sujeto, subtotal_exento_iva, subtotal_sin_impuestos, descuento, ice, iva_12, propina, estado, estado_view) FROM stdin;
\.


--
-- TOC entry 3834 (class 0 OID 33286)
-- Dependencies: 215
-- Data for Name: repositorio_facturas_correo; Type: TABLE DATA; Schema: contabilidad; Owner: postgres
--

COPY repositorio_facturas_correo (id, ruta_acceso, id_correo, estado_proceso_factura, emisor_factura, nombre_archivo, fecha, asunto) FROM stdin;
\.


--
-- TOC entry 4084 (class 0 OID 0)
-- Dependencies: 230
-- Name: repositorio_facturas_id_factura_seq; Type: SEQUENCE SET; Schema: contabilidad; Owner: postgres
--

SELECT pg_catalog.setval('repositorio_facturas_id_factura_seq', 1, false);


--
-- TOC entry 3850 (class 0 OID 33344)
-- Dependencies: 231
-- Data for Name: repositorio_facturas_rechazadas; Type: TABLE DATA; Schema: contabilidad; Owner: postgres
--

COPY repositorio_facturas_rechazadas (id_factura_r, clave_acceso, razon_rechazo, created_at, estado, contenido_correo, emisor_factura, asunto) FROM stdin;
\.


--
-- TOC entry 4085 (class 0 OID 0)
-- Dependencies: 232
-- Name: repositorio_facturas_rechazadas_id_factura_r_seq; Type: SEQUENCE SET; Schema: contabilidad; Owner: postgres
--

SELECT pg_catalog.setval('repositorio_facturas_rechazadas_id_factura_r_seq', 6, true);


--
-- TOC entry 3852 (class 0 OID 33353)
-- Dependencies: 233
-- Data for Name: rol_pagos_empleados; Type: TABLE DATA; Schema: contabilidad; Owner: postgres
--

COPY rol_pagos_empleados (id, id_empleado, mes_pago) FROM stdin;
3	1	6
4	1	6
\.


--
-- TOC entry 4086 (class 0 OID 0)
-- Dependencies: 234
-- Name: rol_pagos_empleados_id_seq; Type: SEQUENCE SET; Schema: contabilidad; Owner: postgres
--

SELECT pg_catalog.setval('rol_pagos_empleados_id_seq', 4, true);


--
-- TOC entry 4087 (class 0 OID 0)
-- Dependencies: 236
-- Name: tipo_cuenta_contable_id_seq; Type: SEQUENCE SET; Schema: contabilidad; Owner: postgres
--

SELECT pg_catalog.setval('tipo_cuenta_contable_id_seq', 2, true);


--
-- TOC entry 3856 (class 0 OID 33368)
-- Dependencies: 237
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
-- TOC entry 3857 (class 0 OID 33372)
-- Dependencies: 238
-- Data for Name: tipo_impuestos; Type: TABLE DATA; Schema: contabilidad; Owner: postgres
--

COPY tipo_impuestos (id, nombre, descripcion, estado, fecha) FROM stdin;
0	no definido	no definido	A	2017-04-12 17:32:55
1	IVA	Impuesto al valor Agregado	A	2017-04-17 17:20:30
2	ICE	Impuestos Consumos Especiales	A	2017-04-17 17:21:11
\.


--
-- TOC entry 4088 (class 0 OID 0)
-- Dependencies: 239
-- Name: tipo_impuestos_id_seq; Type: SEQUENCE SET; Schema: contabilidad; Owner: postgres
--

SELECT pg_catalog.setval('tipo_impuestos_id_seq', 1, false);


--
-- TOC entry 3854 (class 0 OID 33359)
-- Dependencies: 235
-- Data for Name: tipos_cuentas_contables; Type: TABLE DATA; Schema: contabilidad; Owner: postgres
--

COPY tipos_cuentas_contables (id, nombre, descripcion, estado, fecha) FROM stdin;
1	CUENTAS REALES	Se utilizan en el estado de situacion financiero	A	2017-01-20 11:50:11.866106
2	CUENTAS NOMINALES	Se utilizan para el estado de perdidas o ganancias	A	2017-01-20 11:51:08.976658
\.


--
-- TOC entry 3859 (class 0 OID 33378)
-- Dependencies: 240
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
-- TOC entry 4089 (class 0 OID 0)
-- Dependencies: 241
-- Name: tipos_gastos_personales_id_seq; Type: SEQUENCE SET; Schema: contabilidad; Owner: postgres
--

SELECT pg_catalog.setval('tipos_gastos_personales_id_seq', 1, false);


SET search_path = inventario, pg_catalog;

--
-- TOC entry 3861 (class 0 OID 33387)
-- Dependencies: 242
-- Data for Name: bodegas; Type: TABLE DATA; Schema: inventario; Owner: postgres
--

COPY bodegas (id, id_sucursal, nombre, calle, numero, especificaciones, fecha, estado, giro_negocio) FROM stdin;
\.


--
-- TOC entry 4090 (class 0 OID 0)
-- Dependencies: 243
-- Name: bodegas_id_seq; Type: SEQUENCE SET; Schema: inventario; Owner: postgres
--

SELECT pg_catalog.setval('bodegas_id_seq', 1, false);


--
-- TOC entry 3863 (class 0 OID 33396)
-- Dependencies: 244
-- Data for Name: catalogos; Type: TABLE DATA; Schema: inventario; Owner: postgres
--

COPY catalogos (id, tipo_catalogo, producto) FROM stdin;
\.


--
-- TOC entry 4091 (class 0 OID 0)
-- Dependencies: 245
-- Name: catalogos_id_seq; Type: SEQUENCE SET; Schema: inventario; Owner: postgres
--

SELECT pg_catalog.setval('catalogos_id_seq', 1, false);


--
-- TOC entry 3865 (class 0 OID 33401)
-- Dependencies: 246
-- Data for Name: categorias; Type: TABLE DATA; Schema: inventario; Owner: postgres
--

COPY categorias (id, nombre, descripcion, tipo_categoria, estado, fecha, id_padre) FROM stdin;
1	Sin Categoria	No tiene una categoria	1	A	2017-02-17 09:04:57.818015-05	0
\.


--
-- TOC entry 4092 (class 0 OID 0)
-- Dependencies: 247
-- Name: categorias_id_seq; Type: SEQUENCE SET; Schema: inventario; Owner: postgres
--

SELECT pg_catalog.setval('categorias_id_seq', 3, true);


--
-- TOC entry 3867 (class 0 OID 33411)
-- Dependencies: 248
-- Data for Name: descripcion_producto; Type: TABLE DATA; Schema: inventario; Owner: postgres
--

COPY descripcion_producto (id, producto, descripcion_corta, descripcion_proveedor, descripcion_proformas, descripcion_movi_inventa) FROM stdin;
\.


--
-- TOC entry 4093 (class 0 OID 0)
-- Dependencies: 249
-- Name: descripcion_producto_id_seq; Type: SEQUENCE SET; Schema: inventario; Owner: postgres
--

SELECT pg_catalog.setval('descripcion_producto_id_seq', 1, false);


--
-- TOC entry 3869 (class 0 OID 33419)
-- Dependencies: 250
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
-- TOC entry 4094 (class 0 OID 0)
-- Dependencies: 251
-- Name: estado_descriptivo_id_seq; Type: SEQUENCE SET; Schema: inventario; Owner: postgres
--

SELECT pg_catalog.setval('estado_descriptivo_id_seq', 5, true);


--
-- TOC entry 3871 (class 0 OID 33428)
-- Dependencies: 252
-- Data for Name: garantias; Type: TABLE DATA; Schema: inventario; Owner: postgres
--

COPY garantias (id, nombre, descripcion, estado, fecha, tipo_garantia, duracion, id_padre) FROM stdin;
1	Sin garantia	No tiene garantia	A	2017-02-17 09:06:43.824581-05	1	0	0
\.


--
-- TOC entry 4095 (class 0 OID 0)
-- Dependencies: 253
-- Name: garantias_id_seq; Type: SEQUENCE SET; Schema: inventario; Owner: postgres
--

SELECT pg_catalog.setval('garantias_id_seq', 3, true);


--
-- TOC entry 3873 (class 0 OID 33437)
-- Dependencies: 254
-- Data for Name: imagenes_productos; Type: TABLE DATA; Schema: inventario; Owner: postgres
--

COPY imagenes_productos (id, nombre, direccion, tipo_imagen, estado, fecha, producto) FROM stdin;
\.


--
-- TOC entry 3874 (class 0 OID 33441)
-- Dependencies: 255
-- Data for Name: manejo_presios; Type: TABLE DATA; Schema: inventario; Owner: postgres
--

COPY manejo_presios (id, id_producto, nombre, valor_precio, estado, fecha) FROM stdin;
\.


--
-- TOC entry 4096 (class 0 OID 0)
-- Dependencies: 256
-- Name: manejo_presios_id_seq; Type: SEQUENCE SET; Schema: inventario; Owner: postgres
--

SELECT pg_catalog.setval('manejo_presios_id_seq', 1, false);


--
-- TOC entry 3876 (class 0 OID 33450)
-- Dependencies: 257
-- Data for Name: marcas; Type: TABLE DATA; Schema: inventario; Owner: postgres
--

COPY marcas (id, nombre, descripcion, estado, fecha, id_padre) FROM stdin;
1	Sin marca	No tiene marca	A	2017-02-17 09:07:23.375101-05	0
\.


--
-- TOC entry 4097 (class 0 OID 0)
-- Dependencies: 258
-- Name: marcas_id_seq; Type: SEQUENCE SET; Schema: inventario; Owner: postgres
--

SELECT pg_catalog.setval('marcas_id_seq', 1, true);


--
-- TOC entry 3878 (class 0 OID 33459)
-- Dependencies: 259
-- Data for Name: modelos; Type: TABLE DATA; Schema: inventario; Owner: postgres
--

COPY modelos (id, nombre, descripcion, estado, fecha, id_padre) FROM stdin;
1	Sin modelo	No posee un modelo	A	2017-02-17 09:07:59.498661-05	0
\.


--
-- TOC entry 4098 (class 0 OID 0)
-- Dependencies: 260
-- Name: modelos_id_seq; Type: SEQUENCE SET; Schema: inventario; Owner: postgres
--

SELECT pg_catalog.setval('modelos_id_seq', 1, true);


--
-- TOC entry 3880 (class 0 OID 33468)
-- Dependencies: 261
-- Data for Name: productos; Type: TABLE DATA; Schema: inventario; Owner: postgres
--

COPY productos (id, nombre_corto, vendible, comprable, precio, costo, estado_descriptivo, categoria, garantia, marca, modelo, ubicacion, cantidad, descripcion, codigo_baras, tipo_consumo, bodega) FROM stdin;
\.


--
-- TOC entry 4099 (class 0 OID 0)
-- Dependencies: 262
-- Name: productos_id_seq; Type: SEQUENCE SET; Schema: inventario; Owner: postgres
--

SELECT pg_catalog.setval('productos_id_seq', 1, false);


--
-- TOC entry 3882 (class 0 OID 33476)
-- Dependencies: 263
-- Data for Name: productos_impuestos; Type: TABLE DATA; Schema: inventario; Owner: postgres
--

COPY productos_impuestos (id, producto, impuesto) FROM stdin;
\.


--
-- TOC entry 4100 (class 0 OID 0)
-- Dependencies: 264
-- Name: productos_impuestos_id_seq; Type: SEQUENCE SET; Schema: inventario; Owner: postgres
--

SELECT pg_catalog.setval('productos_impuestos_id_seq', 1, false);


--
-- TOC entry 3884 (class 0 OID 33481)
-- Dependencies: 265
-- Data for Name: proveedores; Type: TABLE DATA; Schema: inventario; Owner: postgres
--

COPY proveedores (id, nombre, ruc, direccion, id_empresa) FROM stdin;
\.


--
-- TOC entry 4101 (class 0 OID 0)
-- Dependencies: 266
-- Name: proveedores_id_seq; Type: SEQUENCE SET; Schema: inventario; Owner: postgres
--

SELECT pg_catalog.setval('proveedores_id_seq', 1, false);


--
-- TOC entry 3886 (class 0 OID 33489)
-- Dependencies: 267
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
-- TOC entry 4102 (class 0 OID 0)
-- Dependencies: 268
-- Name: tipo_consumo_id_seq; Type: SEQUENCE SET; Schema: inventario; Owner: postgres
--

SELECT pg_catalog.setval('tipo_consumo_id_seq', 7, true);


--
-- TOC entry 3888 (class 0 OID 33498)
-- Dependencies: 269
-- Data for Name: tipos_catalogos; Type: TABLE DATA; Schema: inventario; Owner: postgres
--

COPY tipos_catalogos (id, nombre, descripcion, fecha_inicio, fecha_fin, estado, fecha) FROM stdin;
\.


--
-- TOC entry 4103 (class 0 OID 0)
-- Dependencies: 270
-- Name: tipos_catalogos_id_seq; Type: SEQUENCE SET; Schema: inventario; Owner: postgres
--

SELECT pg_catalog.setval('tipos_catalogos_id_seq', 1, false);


--
-- TOC entry 3890 (class 0 OID 33507)
-- Dependencies: 271
-- Data for Name: tipos_categorias; Type: TABLE DATA; Schema: inventario; Owner: postgres
--

COPY tipos_categorias (id, nombre, descripcion, estado, fecha) FROM stdin;
1	Sin Tipo Categoria	No posee un tipo de categoria	A	2017-02-17 09:04:46.562617-05
\.


--
-- TOC entry 4104 (class 0 OID 0)
-- Dependencies: 272
-- Name: tipos_categorias_id_seq; Type: SEQUENCE SET; Schema: inventario; Owner: postgres
--

SELECT pg_catalog.setval('tipos_categorias_id_seq', 3, true);


--
-- TOC entry 3892 (class 0 OID 33516)
-- Dependencies: 273
-- Data for Name: tipos_garantias; Type: TABLE DATA; Schema: inventario; Owner: postgres
--

COPY tipos_garantias (id, nombre, descripcion, fecha, estado) FROM stdin;
1	Sin tipo Garantitia	No posee un tipo de garantia	2017-02-17 09:05:42.688275-05	\N
\.


--
-- TOC entry 4105 (class 0 OID 0)
-- Dependencies: 274
-- Name: tipos_garantias_id_seq; Type: SEQUENCE SET; Schema: inventario; Owner: postgres
--

SELECT pg_catalog.setval('tipos_garantias_id_seq', 1, true);


--
-- TOC entry 3894 (class 0 OID 33525)
-- Dependencies: 275
-- Data for Name: tipos_imagenes_productos; Type: TABLE DATA; Schema: inventario; Owner: postgres
--

COPY tipos_imagenes_productos (id, nombre, estado, fecha) FROM stdin;
\.


--
-- TOC entry 4106 (class 0 OID 0)
-- Dependencies: 276
-- Name: tipos_imagenes_productos_id_seq; Type: SEQUENCE SET; Schema: inventario; Owner: postgres
--

SELECT pg_catalog.setval('tipos_imagenes_productos_id_seq', 1, false);


--
-- TOC entry 3896 (class 0 OID 33531)
-- Dependencies: 277
-- Data for Name: tipos_productos; Type: TABLE DATA; Schema: inventario; Owner: postgres
--

COPY tipos_productos (id, nombre, descripcion, estado, fecha) FROM stdin;
\.


--
-- TOC entry 4107 (class 0 OID 0)
-- Dependencies: 278
-- Name: tipos_productos_id_seq; Type: SEQUENCE SET; Schema: inventario; Owner: postgres
--

SELECT pg_catalog.setval('tipos_productos_id_seq', 1, false);


--
-- TOC entry 3898 (class 0 OID 33540)
-- Dependencies: 279
-- Data for Name: tipos_tipo_consumo; Type: TABLE DATA; Schema: inventario; Owner: postgres
--

COPY tipos_tipo_consumo (id, nombre, descripcion, estado, fecha) FROM stdin;
\.


--
-- TOC entry 4108 (class 0 OID 0)
-- Dependencies: 280
-- Name: tipos_tipo_consumo_id_seq; Type: SEQUENCE SET; Schema: inventario; Owner: postgres
--

SELECT pg_catalog.setval('tipos_tipo_consumo_id_seq', 1, false);


--
-- TOC entry 3900 (class 0 OID 33549)
-- Dependencies: 281
-- Data for Name: ubicaciones; Type: TABLE DATA; Schema: inventario; Owner: postgres
--

COPY ubicaciones (id, nombre, descripcion, id_padre, estado, fecha) FROM stdin;
1	Edificio Matriz	Sucursal Principal de la Empresa	0	A	2017-03-20 10:43:09.411446-05
\.


--
-- TOC entry 4109 (class 0 OID 0)
-- Dependencies: 282
-- Name: ubicaciones_id_seq; Type: SEQUENCE SET; Schema: inventario; Owner: postgres
--

SELECT pg_catalog.setval('ubicaciones_id_seq', 1, true);


SET search_path = public, pg_catalog;

--
-- TOC entry 3902 (class 0 OID 33559)
-- Dependencies: 283
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
\.


--
-- TOC entry 3903 (class 0 OID 33563)
-- Dependencies: 284
-- Data for Name: operadoras_telefonicas; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY operadoras_telefonicas (id, nombre, descripcion, estado, fecha) FROM stdin;
2	MOVISTAR	Operadora Celular	A	16:20:01.92526-05
1	CLARO	Operadora Celular	A	16:19:39.531288-05
3	CNT CELULAR	Operadora Celular	A	16:20:36.933809-05
4	CNT FIJO	Operadora Fijo	A	16:20:58.696937-05
\.


--
-- TOC entry 4110 (class 0 OID 0)
-- Dependencies: 285
-- Name: operadoras_telefonicas_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('operadoras_telefonicas_id_seq', 1, false);


--
-- TOC entry 3905 (class 0 OID 33572)
-- Dependencies: 286
-- Data for Name: personas; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY personas (id, primer_nombre, segundo_nombre, primer_apellido, segundo_apellido, id_localidad, calle, transversal, numero) FROM stdin;
1	Consumidor Final	\N	 	\N	1	 	 	 
\.


--
-- TOC entry 3906 (class 0 OID 33578)
-- Dependencies: 287
-- Data for Name: personas_correo_electronico; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY personas_correo_electronico (id, id_persona, correo_electronico, estado, fecha) FROM stdin;
\.


--
-- TOC entry 4111 (class 0 OID 0)
-- Dependencies: 288
-- Name: personas_correo_electronico_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('personas_correo_electronico_id_seq', 1, false);


--
-- TOC entry 3908 (class 0 OID 33584)
-- Dependencies: 289
-- Data for Name: personas_documentos_identificacion; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY personas_documentos_identificacion (id, id_persona, id_tipo_documento, numero_identificacion, estado, fecha) FROM stdin;
1	1	2	99999999	A	14:42:26.638127-05
\.


--
-- TOC entry 4112 (class 0 OID 0)
-- Dependencies: 290
-- Name: personas_documentos_identificacion_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('personas_documentos_identificacion_id_seq', 1, true);


--
-- TOC entry 4113 (class 0 OID 0)
-- Dependencies: 291
-- Name: personas_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('personas_id_seq', 2, true);


--
-- TOC entry 3911 (class 0 OID 33592)
-- Dependencies: 292
-- Data for Name: telefonos_personas; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY telefonos_personas (id, id_persona, numero, fecha, estado, id_operadora_telefonica) FROM stdin;
\.


--
-- TOC entry 4114 (class 0 OID 0)
-- Dependencies: 293
-- Name: telefonos_personas_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('telefonos_personas_id_seq', 1, false);


--
-- TOC entry 3913 (class 0 OID 33598)
-- Dependencies: 294
-- Data for Name: tipo_documento_identificacion; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY tipo_documento_identificacion (id, nombre, descripcion, estado, fecha) FROM stdin;
1	CEDULA	Cedula	A	15:51:09.398118-05
2	RUC	Ruc	A	15:51:19.429108-05
3	PASAPORTE	Pasaporte	A	15:51:33.948385-05
\.


--
-- TOC entry 4115 (class 0 OID 0)
-- Dependencies: 295
-- Name: tipo_documento_identificaion_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('tipo_documento_identificaion_id_seq', 1, false);


SET search_path = talento_humano, pg_catalog;

--
-- TOC entry 3916 (class 0 OID 33629)
-- Dependencies: 300
-- Data for Name: cargos; Type: TABLE DATA; Schema: talento_humano; Owner: postgres
--

COPY cargos (id, nombre, estado, fecha, id_padre) FROM stdin;
1	Administrador	A	2017-05-18 15:28:06.929823	0
\.


--
-- TOC entry 4116 (class 0 OID 0)
-- Dependencies: 301
-- Name: cargos_id_seq; Type: SEQUENCE SET; Schema: talento_humano; Owner: postgres
--

SELECT pg_catalog.setval('cargos_id_seq', 1, false);


--
-- TOC entry 3918 (class 0 OID 33635)
-- Dependencies: 302
-- Data for Name: empleados; Type: TABLE DATA; Schema: talento_humano; Owner: postgres
--

COPY empleados (id, id_persona, estado, fecha, id_usuario, id_cargo) FROM stdin;
1	1	A	2017-06-05 12:46:35.094297-05	usuario prueba 1	\N
\.


--
-- TOC entry 4117 (class 0 OID 0)
-- Dependencies: 303
-- Name: empleados_id_seq; Type: SEQUENCE SET; Schema: talento_humano; Owner: postgres
--

SELECT pg_catalog.setval('empleados_id_seq', 6, true);


--
-- TOC entry 3920 (class 0 OID 33645)
-- Dependencies: 305
-- Data for Name: jornadas_de_trabajo; Type: TABLE DATA; Schema: talento_humano; Owner: postgres
--

COPY jornadas_de_trabajo (id, nombre, descripcion, porsentaje_cobro, hora_inicio, hora_fin, hora_descanso) FROM stdin;
\.


--
-- TOC entry 4118 (class 0 OID 0)
-- Dependencies: 306
-- Name: jornadas_de_trabajo_id_seq; Type: SEQUENCE SET; Schema: talento_humano; Owner: postgres
--

SELECT pg_catalog.setval('jornadas_de_trabajo_id_seq', 1, false);


--
-- TOC entry 3922 (class 0 OID 33653)
-- Dependencies: 307
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
-- TOC entry 4119 (class 0 OID 0)
-- Dependencies: 308
-- Name: tipos_contratos_id_seq; Type: SEQUENCE SET; Schema: talento_humano; Owner: postgres
--

SELECT pg_catalog.setval('tipos_contratos_id_seq', 8, true);


SET search_path = usuarios, pg_catalog;

--
-- TOC entry 3924 (class 0 OID 33662)
-- Dependencies: 309
-- Data for Name: tipo_usuario; Type: TABLE DATA; Schema: usuarios; Owner: postgres
--

COPY tipo_usuario (id, nombre, descripcion, estado, fecha) FROM stdin;
1	ADMIN	Ninguna	A	11:39:13.423733-05
\.


--
-- TOC entry 4120 (class 0 OID 0)
-- Dependencies: 310
-- Name: tipo_usuario_id_seq; Type: SEQUENCE SET; Schema: usuarios; Owner: postgres
--

SELECT pg_catalog.setval('tipo_usuario_id_seq', 1, true);


--
-- TOC entry 3926 (class 0 OID 33671)
-- Dependencies: 311
-- Data for Name: usuarios; Type: TABLE DATA; Schema: usuarios; Owner: postgres
--

COPY usuarios (id, nick, clave_clave, id_estado, fecha_creacion, estado_clave, id_tipo_usuario) FROM stdin;
usuario prueba 1	prueba	123455	A	\N	t	1
\.


SET search_path = ventas, pg_catalog;

--
-- TOC entry 3927 (class 0 OID 33675)
-- Dependencies: 312
-- Data for Name: caja; Type: TABLE DATA; Schema: ventas; Owner: postgres
--

COPY caja (id, nombre, id_sucursal, inicio_numero_factura, numero_fin_factura, estado, fecha) FROM stdin;
\.


--
-- TOC entry 4121 (class 0 OID 0)
-- Dependencies: 313
-- Name: caja_id_seq; Type: SEQUENCE SET; Schema: ventas; Owner: postgres
--

SELECT pg_catalog.setval('caja_id_seq', 1, false);


--
-- TOC entry 3929 (class 0 OID 33681)
-- Dependencies: 314
-- Data for Name: caja_usuario; Type: TABLE DATA; Schema: ventas; Owner: postgres
--

COPY caja_usuario (id_caja, id_usuario, id_empleado, estado, fecha) FROM stdin;
\.


--
-- TOC entry 3930 (class 0 OID 33685)
-- Dependencies: 315
-- Data for Name: clave_factura; Type: TABLE DATA; Schema: ventas; Owner: postgres
--

COPY clave_factura (id, id_factura, clave_factura, estado, fecha) FROM stdin;
\.


--
-- TOC entry 4122 (class 0 OID 0)
-- Dependencies: 316
-- Name: clave_factura_id_seq; Type: SEQUENCE SET; Schema: ventas; Owner: postgres
--

SELECT pg_catalog.setval('clave_factura_id_seq', 1, false);


--
-- TOC entry 3932 (class 0 OID 33691)
-- Dependencies: 317
-- Data for Name: detalle_factura; Type: TABLE DATA; Schema: ventas; Owner: postgres
--

COPY detalle_factura (id, id_factura, id_producto, precio_venta, cantidad, descuento, subtotal_item) FROM stdin;
\.


--
-- TOC entry 4123 (class 0 OID 0)
-- Dependencies: 318
-- Name: detalle_factura_id_seq; Type: SEQUENCE SET; Schema: ventas; Owner: postgres
--

SELECT pg_catalog.setval('detalle_factura_id_seq', 1, false);


--
-- TOC entry 3934 (class 0 OID 33696)
-- Dependencies: 319
-- Data for Name: empleado_factura; Type: TABLE DATA; Schema: ventas; Owner: postgres
--

COPY empleado_factura (id_empleado, id_factura, fecha) FROM stdin;
\.


--
-- TOC entry 3935 (class 0 OID 33700)
-- Dependencies: 320
-- Data for Name: facturas; Type: TABLE DATA; Schema: ventas; Owner: postgres
--

COPY facturas (id, numero_factura, numero_autorizacion, ruc_emisor, denominacion, direccion_matriz, direccion_sucursal, fecha_autorizacion, fecha_emicion, guia_remision, fecha_caducidad_factura, datos_imprenta, subtotal_iva, subtotal_sin_iva, descuentos, valor_iva, ice, total, estado, id_cliente) FROM stdin;
\.


--
-- TOC entry 4124 (class 0 OID 0)
-- Dependencies: 321
-- Name: facturas_id_seq; Type: SEQUENCE SET; Schema: ventas; Owner: postgres
--

SELECT pg_catalog.setval('facturas_id_seq', 1, false);


--
-- TOC entry 3915 (class 0 OID 33612)
-- Dependencies: 297
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
-- TOC entry 3937 (class 0 OID 33709)
-- Dependencies: 322
-- Data for Name: formas_pago_facturas; Type: TABLE DATA; Schema: ventas; Owner: postgres
--

COPY formas_pago_facturas (id, id_factura, id_formas_pago) FROM stdin;
\.


--
-- TOC entry 4125 (class 0 OID 0)
-- Dependencies: 323
-- Name: formas_pago_facturas_id_seq; Type: SEQUENCE SET; Schema: ventas; Owner: postgres
--

SELECT pg_catalog.setval('formas_pago_facturas_id_seq', 1, false);


--
-- TOC entry 4126 (class 0 OID 0)
-- Dependencies: 324
-- Name: formas_pago_id_seq; Type: SEQUENCE SET; Schema: ventas; Owner: postgres
--

SELECT pg_catalog.setval('formas_pago_id_seq', 14, true);


--
-- TOC entry 3940 (class 0 OID 33716)
-- Dependencies: 325
-- Data for Name: producto_descuento; Type: TABLE DATA; Schema: ventas; Owner: postgres
--

COPY producto_descuento (id, id_producto, id_catalogo, estado, fecha_fin_descuento, fecha_inicio_descuento) FROM stdin;
\.


--
-- TOC entry 4127 (class 0 OID 0)
-- Dependencies: 326
-- Name: producto_descuento_id_seq; Type: SEQUENCE SET; Schema: ventas; Owner: postgres
--

SELECT pg_catalog.setval('producto_descuento_id_seq', 1, false);


SET search_path = "Taller_mecanico", pg_catalog;

--
-- TOC entry 3381 (class 2606 OID 33790)
-- Name: Aseguradora_PK; Type: CONSTRAINT; Schema: Taller_mecanico; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY "Aseguradora"
    ADD CONSTRAINT "Aseguradora_PK" PRIMARY KEY (id);


SET search_path = administracion, pg_catalog;

--
-- TOC entry 3383 (class 2606 OID 33792)
-- Name: actividad_economica_PK; Type: CONSTRAINT; Schema: administracion; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY actividad_economica
    ADD CONSTRAINT "actividad_economica_PK" PRIMARY KEY (id);


--
-- TOC entry 3385 (class 2606 OID 33794)
-- Name: clientes_PK; Type: CONSTRAINT; Schema: administracion; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY clientes
    ADD CONSTRAINT "clientes_PK" PRIMARY KEY (id, tipo_cliente);


--
-- TOC entry 3387 (class 2606 OID 33796)
-- Name: empresas_PK; Type: CONSTRAINT; Schema: administracion; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY empresas
    ADD CONSTRAINT "empresas_PK" PRIMARY KEY (id);


--
-- TOC entry 3393 (class 2606 OID 33798)
-- Name: id_tipo_accion_vista_PK; Type: CONSTRAINT; Schema: administracion; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY tipo_accion_vista
    ADD CONSTRAINT "id_tipo_accion_vista_PK" PRIMARY KEY (id);


--
-- TOC entry 3391 (class 2606 OID 33800)
-- Name: imagen_empresa_PK; Type: CONSTRAINT; Schema: administracion; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY imagen_empresa
    ADD CONSTRAINT "imagen_empresa_PK" PRIMARY KEY (id);


--
-- TOC entry 3395 (class 2606 OID 33802)
-- Name: tipo_bienes_servicios_PK; Type: CONSTRAINT; Schema: administracion; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY tipo_bienes_servicios
    ADD CONSTRAINT "tipo_bienes_servicios_PK" PRIMARY KEY (id);


--
-- TOC entry 3397 (class 2606 OID 33804)
-- Name: tipo_empres; Type: CONSTRAINT; Schema: administracion; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY tipo_empresa
    ADD CONSTRAINT tipo_empres PRIMARY KEY (id);


--
-- TOC entry 3399 (class 2606 OID 33806)
-- Name: tipo_imagen_producto_PK; Type: CONSTRAINT; Schema: administracion; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY tipos_imagenes_empresas
    ADD CONSTRAINT "tipo_imagen_producto_PK" PRIMARY KEY (id);


--
-- TOC entry 3401 (class 2606 OID 33808)
-- Name: usuarios_privilegios_PK; Type: CONSTRAINT; Schema: administracion; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY usuarios_privilegios
    ADD CONSTRAINT "usuarios_privilegios_PK" PRIMARY KEY (id);


--
-- TOC entry 3389 (class 2606 OID 33810)
-- Name: valor_unico; Type: CONSTRAINT; Schema: administracion; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY empresas
    ADD CONSTRAINT valor_unico UNIQUE (razon_social);


--
-- TOC entry 3403 (class 2606 OID 33812)
-- Name: vistas_PK; Type: CONSTRAINT; Schema: administracion; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY vistas
    ADD CONSTRAINT "vistas_PK" PRIMARY KEY (id);


SET search_path = auditoria, pg_catalog;

--
-- TOC entry 3405 (class 2606 OID 33814)
-- Name: auditoria_pk; Type: CONSTRAINT; Schema: auditoria; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY auditoria
    ADD CONSTRAINT auditoria_pk PRIMARY KEY (id);


--
-- TOC entry 3407 (class 2606 OID 33816)
-- Name: ingreso_usuarios_PK; Type: CONSTRAINT; Schema: auditoria; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY ingresos_usuarios
    ADD CONSTRAINT "ingreso_usuarios_PK" PRIMARY KEY (id);


SET search_path = contabilidad, pg_catalog;

--
-- TOC entry 3411 (class 2606 OID 33818)
-- Name: ambito_impuesto_PK; Type: CONSTRAINT; Schema: contabilidad; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY ambitos_impuestos
    ADD CONSTRAINT "ambito_impuesto_PK" PRIMARY KEY (id);


--
-- TOC entry 3413 (class 2606 OID 33820)
-- Name: asiento_contable_PK; Type: CONSTRAINT; Schema: contabilidad; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY asientos_contables_diario
    ADD CONSTRAINT "asiento_contable_PK" PRIMARY KEY (id);


--
-- TOC entry 3415 (class 2606 OID 33822)
-- Name: bancos_PK; Type: CONSTRAINT; Schema: contabilidad; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY bancos
    ADD CONSTRAINT "bancos_PK" PRIMARY KEY (id);


--
-- TOC entry 3417 (class 2606 OID 33824)
-- Name: cuenta_contable_PK; Type: CONSTRAINT; Schema: contabilidad; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY cuentas_contables
    ADD CONSTRAINT "cuenta_contable_PK" PRIMARY KEY (id);


--
-- TOC entry 3433 (class 2606 OID 33826)
-- Name: facturas_pkey; Type: CONSTRAINT; Schema: contabilidad; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY repositorio_facturas
    ADD CONSTRAINT facturas_pkey PRIMARY KEY (id_factura);


--
-- TOC entry 3435 (class 2606 OID 33828)
-- Name: facturas_rechazadas_pkey; Type: CONSTRAINT; Schema: contabilidad; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY repositorio_facturas_rechazadas
    ADD CONSTRAINT facturas_rechazadas_pkey PRIMARY KEY (id_factura_r);


--
-- TOC entry 3421 (class 2606 OID 33830)
-- Name: fecha_declaracion_impuestos; Type: CONSTRAINT; Schema: contabilidad; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY fecha_declaracion_ruc
    ADD CONSTRAINT fecha_declaracion_impuestos PRIMARY KEY (noveno_dig);


--
-- TOC entry 3423 (class 2606 OID 33832)
-- Name: finaciamiento_PK; Type: CONSTRAINT; Schema: contabilidad; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY finaciaminto
    ADD CONSTRAINT "finaciamiento_PK" PRIMARY KEY (id);


--
-- TOC entry 3425 (class 2606 OID 33834)
-- Name: gasto_mes_factura; Type: CONSTRAINT; Schema: contabilidad; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY gasto_mes_repositorio
    ADD CONSTRAINT gasto_mes_factura PRIMARY KEY (id);


--
-- TOC entry 3427 (class 2606 OID 33836)
-- Name: gastos_impueto_renta_deducion_PK; Type: CONSTRAINT; Schema: contabilidad; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY gastos_impuestos_renta_deduccion
    ADD CONSTRAINT "gastos_impueto_renta_deducion_PK" PRIMARY KEY (id);


--
-- TOC entry 3445 (class 2606 OID 33838)
-- Name: gastos_personales_PK; Type: CONSTRAINT; Schema: contabilidad; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY tipos_gastos_personales
    ADD CONSTRAINT "gastos_personales_PK" PRIMARY KEY (id);


--
-- TOC entry 3429 (class 2606 OID 33840)
-- Name: grupo_impuesto_PK; Type: CONSTRAINT; Schema: contabilidad; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY grupo_impuestos
    ADD CONSTRAINT "grupo_impuesto_PK" PRIMARY KEY (id);


--
-- TOC entry 3431 (class 2606 OID 33842)
-- Name: impuesto_PK; Type: CONSTRAINT; Schema: contabilidad; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY impuestos
    ADD CONSTRAINT "impuesto_PK" PRIMARY KEY (id);


--
-- TOC entry 3409 (class 2606 OID 33844)
-- Name: plazos_credito_PK; Type: CONSTRAINT; Schema: contabilidad; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY plazos_credito
    ADD CONSTRAINT "plazos_credito_PK" PRIMARY KEY (id);


--
-- TOC entry 3419 (class 2606 OID 33846)
-- Name: repositorio_facturas_correo_PK; Type: CONSTRAINT; Schema: contabilidad; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY repositorio_facturas_correo
    ADD CONSTRAINT "repositorio_facturas_correo_PK" PRIMARY KEY (id);


--
-- TOC entry 3437 (class 2606 OID 33848)
-- Name: rol_pagos_PK; Type: CONSTRAINT; Schema: contabilidad; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY rol_pagos_empleados
    ADD CONSTRAINT "rol_pagos_PK" PRIMARY KEY (id);


--
-- TOC entry 3439 (class 2606 OID 33850)
-- Name: tipo_cueta_contable; Type: CONSTRAINT; Schema: contabilidad; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY tipos_cuentas_contables
    ADD CONSTRAINT tipo_cueta_contable PRIMARY KEY (id);


--
-- TOC entry 3441 (class 2606 OID 33852)
-- Name: tipo_documentos_pkey; Type: CONSTRAINT; Schema: contabilidad; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY tipo_documentos
    ADD CONSTRAINT tipo_documentos_pkey PRIMARY KEY (id);


--
-- TOC entry 3443 (class 2606 OID 33854)
-- Name: tipo_impuestos_pkey; Type: CONSTRAINT; Schema: contabilidad; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY tipo_impuestos
    ADD CONSTRAINT tipo_impuestos_pkey PRIMARY KEY (id);


SET search_path = inventario, pg_catalog;

--
-- TOC entry 3447 (class 2606 OID 33856)
-- Name: bodega_pro_PK; Type: CONSTRAINT; Schema: inventario; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY bodegas
    ADD CONSTRAINT "bodega_pro_PK" PRIMARY KEY (id);


--
-- TOC entry 3451 (class 2606 OID 33858)
-- Name: categorias_PK; Type: CONSTRAINT; Schema: inventario; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY categorias
    ADD CONSTRAINT "categorias_PK" PRIMARY KEY (id);


--
-- TOC entry 3453 (class 2606 OID 33860)
-- Name: descripcion_producto_PK; Type: CONSTRAINT; Schema: inventario; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY descripcion_producto
    ADD CONSTRAINT "descripcion_producto_PK" PRIMARY KEY (id);


--
-- TOC entry 3455 (class 2606 OID 33862)
-- Name: estado_descriptivo_PK; Type: CONSTRAINT; Schema: inventario; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY estado_descriptivo
    ADD CONSTRAINT "estado_descriptivo_PK" PRIMARY KEY (id);


--
-- TOC entry 3457 (class 2606 OID 33864)
-- Name: garantia_PK; Type: CONSTRAINT; Schema: inventario; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY garantias
    ADD CONSTRAINT "garantia_PK" PRIMARY KEY (id);


--
-- TOC entry 3449 (class 2606 OID 33866)
-- Name: id; Type: CONSTRAINT; Schema: inventario; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY catalogos
    ADD CONSTRAINT id PRIMARY KEY (id);


--
-- TOC entry 3459 (class 2606 OID 33868)
-- Name: imagenes_productos_PK; Type: CONSTRAINT; Schema: inventario; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY imagenes_productos
    ADD CONSTRAINT "imagenes_productos_PK" PRIMARY KEY (id);


--
-- TOC entry 3461 (class 2606 OID 33870)
-- Name: manejo_presios_PK; Type: CONSTRAINT; Schema: inventario; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY manejo_presios
    ADD CONSTRAINT "manejo_presios_PK" PRIMARY KEY (id);


--
-- TOC entry 3463 (class 2606 OID 33872)
-- Name: marca_PK; Type: CONSTRAINT; Schema: inventario; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY marcas
    ADD CONSTRAINT "marca_PK" PRIMARY KEY (id);


--
-- TOC entry 3465 (class 2606 OID 33874)
-- Name: modelos_PK; Type: CONSTRAINT; Schema: inventario; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY modelos
    ADD CONSTRAINT "modelos_PK" PRIMARY KEY (id);


--
-- TOC entry 3467 (class 2606 OID 33876)
-- Name: producto_PK; Type: CONSTRAINT; Schema: inventario; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY productos
    ADD CONSTRAINT "producto_PK" PRIMARY KEY (id);


--
-- TOC entry 3469 (class 2606 OID 33878)
-- Name: productos_impuestos_PK; Type: CONSTRAINT; Schema: inventario; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY productos_impuestos
    ADD CONSTRAINT "productos_impuestos_PK" PRIMARY KEY (id);


--
-- TOC entry 3471 (class 2606 OID 33880)
-- Name: proveedores_PK; Type: CONSTRAINT; Schema: inventario; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY proveedores
    ADD CONSTRAINT "proveedores_PK" PRIMARY KEY (id);


--
-- TOC entry 3475 (class 2606 OID 33882)
-- Name: tipo_catalogo_PK; Type: CONSTRAINT; Schema: inventario; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY tipos_catalogos
    ADD CONSTRAINT "tipo_catalogo_PK" PRIMARY KEY (id);


--
-- TOC entry 3473 (class 2606 OID 33884)
-- Name: tipo_consumo_pkey; Type: CONSTRAINT; Schema: inventario; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY tipo_consumo
    ADD CONSTRAINT tipo_consumo_pkey PRIMARY KEY (id);


--
-- TOC entry 3481 (class 2606 OID 33886)
-- Name: tipo_imagen_producto_PK; Type: CONSTRAINT; Schema: inventario; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY tipos_imagenes_productos
    ADD CONSTRAINT "tipo_imagen_producto_PK" PRIMARY KEY (id);


--
-- TOC entry 3483 (class 2606 OID 33888)
-- Name: tipo_pruducto_PK; Type: CONSTRAINT; Schema: inventario; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY tipos_productos
    ADD CONSTRAINT "tipo_pruducto_PK" PRIMARY KEY (id);


--
-- TOC entry 3477 (class 2606 OID 33890)
-- Name: tipos_categorias_PK; Type: CONSTRAINT; Schema: inventario; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY tipos_categorias
    ADD CONSTRAINT "tipos_categorias_PK" PRIMARY KEY (id);


--
-- TOC entry 3479 (class 2606 OID 33892)
-- Name: tipos_garantia_PK; Type: CONSTRAINT; Schema: inventario; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY tipos_garantias
    ADD CONSTRAINT "tipos_garantia_PK" PRIMARY KEY (id);


--
-- TOC entry 3485 (class 2606 OID 33894)
-- Name: tipos_tipo_consumo_PK; Type: CONSTRAINT; Schema: inventario; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY tipos_tipo_consumo
    ADD CONSTRAINT "tipos_tipo_consumo_PK" PRIMARY KEY (id);


--
-- TOC entry 3487 (class 2606 OID 33896)
-- Name: ubicacion_PK; Type: CONSTRAINT; Schema: inventario; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY ubicaciones
    ADD CONSTRAINT "ubicacion_PK" PRIMARY KEY (id);


SET search_path = public, pg_catalog;

--
-- TOC entry 3495 (class 2606 OID 33898)
-- Name: correo_elctronico_PK; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY personas_correo_electronico
    ADD CONSTRAINT "correo_elctronico_PK" PRIMARY KEY (id);


--
-- TOC entry 3497 (class 2606 OID 33900)
-- Name: documeto_identificacion; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY personas_documentos_identificacion
    ADD CONSTRAINT documeto_identificacion PRIMARY KEY (id_persona, numero_identificacion);


--
-- TOC entry 3489 (class 2606 OID 33902)
-- Name: estado_PK; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY estados
    ADD CONSTRAINT "estado_PK" PRIMARY KEY (id);


--
-- TOC entry 3491 (class 2606 OID 33904)
-- Name: operadoras_telefonicas_PK; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY operadoras_telefonicas
    ADD CONSTRAINT "operadoras_telefonicas_PK" PRIMARY KEY (id);


--
-- TOC entry 3493 (class 2606 OID 33906)
-- Name: persona_PK; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY personas
    ADD CONSTRAINT "persona_PK" PRIMARY KEY (id);


--
-- TOC entry 3499 (class 2606 OID 33908)
-- Name: telefonos_personas_PK; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY telefonos_personas
    ADD CONSTRAINT "telefonos_personas_PK" PRIMARY KEY (id);


--
-- TOC entry 3501 (class 2606 OID 33910)
-- Name: tipo_documento_identificacion_PK; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY tipo_documento_identificacion
    ADD CONSTRAINT "tipo_documento_identificacion_PK" PRIMARY KEY (id);


SET search_path = talento_humano, pg_catalog;

--
-- TOC entry 3507 (class 2606 OID 33912)
-- Name: empleado_PK; Type: CONSTRAINT; Schema: talento_humano; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY empleados
    ADD CONSTRAINT "empleado_PK" PRIMARY KEY (id);


--
-- TOC entry 3505 (class 2606 OID 33914)
-- Name: id_cargo_PK; Type: CONSTRAINT; Schema: talento_humano; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY cargos
    ADD CONSTRAINT "id_cargo_PK" PRIMARY KEY (id);


--
-- TOC entry 3509 (class 2606 OID 33916)
-- Name: jornada_trabajo_PK; Type: CONSTRAINT; Schema: talento_humano; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY jornadas_de_trabajo
    ADD CONSTRAINT "jornada_trabajo_PK" PRIMARY KEY (id);


--
-- TOC entry 3511 (class 2606 OID 33918)
-- Name: tipo_contrato_PK; Type: CONSTRAINT; Schema: talento_humano; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY tipos_contratos
    ADD CONSTRAINT "tipo_contrato_PK" PRIMARY KEY (id);


SET search_path = usuarios, pg_catalog;

--
-- TOC entry 3513 (class 2606 OID 33920)
-- Name: tipo_usuario_PK; Type: CONSTRAINT; Schema: usuarios; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY tipo_usuario
    ADD CONSTRAINT "tipo_usuario_PK" PRIMARY KEY (id);


--
-- TOC entry 3515 (class 2606 OID 33922)
-- Name: usuarios_PK; Type: CONSTRAINT; Schema: usuarios; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY usuarios
    ADD CONSTRAINT "usuarios_PK" PRIMARY KEY (id);


SET search_path = ventas, pg_catalog;

--
-- TOC entry 3519 (class 2606 OID 33924)
-- Name: caja_usuario_PK; Type: CONSTRAINT; Schema: ventas; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY caja_usuario
    ADD CONSTRAINT "caja_usuario_PK" PRIMARY KEY (id_caja, id_usuario, id_empleado);


--
-- TOC entry 3523 (class 2606 OID 33926)
-- Name: detalle_factura_pkey; Type: CONSTRAINT; Schema: ventas; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY detalle_factura
    ADD CONSTRAINT detalle_factura_pkey PRIMARY KEY (id);


--
-- TOC entry 3525 (class 2606 OID 33928)
-- Name: empleado_factura_PK; Type: CONSTRAINT; Schema: ventas; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY empleado_factura
    ADD CONSTRAINT "empleado_factura_PK" PRIMARY KEY (id_empleado, id_factura);


--
-- TOC entry 3527 (class 2606 OID 33930)
-- Name: factura_PK; Type: CONSTRAINT; Schema: ventas; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY facturas
    ADD CONSTRAINT "factura_PK" PRIMARY KEY (id);


--
-- TOC entry 3529 (class 2606 OID 33932)
-- Name: formas_pago_facturas_PK; Type: CONSTRAINT; Schema: ventas; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY formas_pago_facturas
    ADD CONSTRAINT "formas_pago_facturas_PK" PRIMARY KEY (id);


--
-- TOC entry 3503 (class 2606 OID 33934)
-- Name: formas_pago_pkey; Type: CONSTRAINT; Schema: ventas; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY formas_pago
    ADD CONSTRAINT formas_pago_pkey PRIMARY KEY (id);


--
-- TOC entry 3517 (class 2606 OID 33936)
-- Name: id_caja_PK; Type: CONSTRAINT; Schema: ventas; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY caja
    ADD CONSTRAINT "id_caja_PK" PRIMARY KEY (id);


--
-- TOC entry 3521 (class 2606 OID 33938)
-- Name: id_clave_factura_PK; Type: CONSTRAINT; Schema: ventas; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY clave_factura
    ADD CONSTRAINT "id_clave_factura_PK" PRIMARY KEY (id);


--
-- TOC entry 3531 (class 2606 OID 33940)
-- Name: producto_descuento_PK; Type: CONSTRAINT; Schema: ventas; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY producto_descuento
    ADD CONSTRAINT "producto_descuento_PK" PRIMARY KEY (id);


SET search_path = administracion, pg_catalog;

--
-- TOC entry 3619 (class 2620 OID 33941)
-- Name: actividad_economica_tg_audit; Type: TRIGGER; Schema: administracion; Owner: postgres
--

CREATE TRIGGER actividad_economica_tg_audit AFTER INSERT OR DELETE OR UPDATE ON actividad_economica FOR EACH ROW EXECUTE PROCEDURE public.fun_auditoria();


--
-- TOC entry 3620 (class 2620 OID 33942)
-- Name: clientes_tg_audit; Type: TRIGGER; Schema: administracion; Owner: postgres
--

CREATE TRIGGER clientes_tg_audit AFTER INSERT OR DELETE OR UPDATE ON clientes FOR EACH ROW EXECUTE PROCEDURE public.fun_auditoria();


--
-- TOC entry 3621 (class 2620 OID 33943)
-- Name: empresas_tg_audit; Type: TRIGGER; Schema: administracion; Owner: postgres
--

CREATE TRIGGER empresas_tg_audit AFTER INSERT OR DELETE OR UPDATE ON empresas FOR EACH ROW EXECUTE PROCEDURE public.fun_auditoria();


--
-- TOC entry 3623 (class 2620 OID 33944)
-- Name: empresas_tg_audit; Type: TRIGGER; Schema: administracion; Owner: postgres
--

CREATE TRIGGER empresas_tg_audit AFTER INSERT OR DELETE OR UPDATE ON imagen_empresa FOR EACH ROW EXECUTE PROCEDURE public.fun_auditoria();


--
-- TOC entry 3622 (class 2620 OID 33945)
-- Name: empresas_tg_cliente; Type: TRIGGER; Schema: administracion; Owner: postgres
--

CREATE TRIGGER empresas_tg_cliente AFTER INSERT OR DELETE OR UPDATE ON empresas FOR EACH ROW EXECUTE PROCEDURE public.fun_cliente_empresa();


--
-- TOC entry 3624 (class 2620 OID 33946)
-- Name: tipo_accion_vista_tg_audit; Type: TRIGGER; Schema: administracion; Owner: postgres
--

CREATE TRIGGER tipo_accion_vista_tg_audit AFTER INSERT OR DELETE OR UPDATE ON tipo_accion_vista FOR EACH ROW EXECUTE PROCEDURE public.fun_auditoria();


--
-- TOC entry 3625 (class 2620 OID 33947)
-- Name: tipo_bienes_servicios_vista_tg_audit; Type: TRIGGER; Schema: administracion; Owner: postgres
--

CREATE TRIGGER tipo_bienes_servicios_vista_tg_audit AFTER INSERT OR DELETE OR UPDATE ON tipo_bienes_servicios FOR EACH ROW EXECUTE PROCEDURE public.fun_auditoria();


--
-- TOC entry 3626 (class 2620 OID 33948)
-- Name: tipo_empresa_tg_audit; Type: TRIGGER; Schema: administracion; Owner: postgres
--

CREATE TRIGGER tipo_empresa_tg_audit AFTER INSERT OR DELETE OR UPDATE ON tipo_empresa FOR EACH ROW EXECUTE PROCEDURE public.fun_auditoria();


--
-- TOC entry 3627 (class 2620 OID 33949)
-- Name: usuarios_privilegios_tg_audit; Type: TRIGGER; Schema: administracion; Owner: postgres
--

CREATE TRIGGER usuarios_privilegios_tg_audit AFTER INSERT OR DELETE OR UPDATE ON usuarios_privilegios FOR EACH ROW EXECUTE PROCEDURE public.fun_auditoria();


SET search_path = contabilidad, pg_catalog;

--
-- TOC entry 3629 (class 2620 OID 33950)
-- Name: asientos_contables_diario_tg_audit; Type: TRIGGER; Schema: contabilidad; Owner: postgres
--

CREATE TRIGGER asientos_contables_diario_tg_audit AFTER INSERT OR DELETE OR UPDATE ON asientos_contables_diario FOR EACH ROW EXECUTE PROCEDURE public.fun_auditoria();


--
-- TOC entry 3630 (class 2620 OID 33951)
-- Name: bancos_tg_audit; Type: TRIGGER; Schema: contabilidad; Owner: postgres
--

CREATE TRIGGER bancos_tg_audit AFTER INSERT OR DELETE OR UPDATE ON bancos FOR EACH ROW EXECUTE PROCEDURE public.fun_auditoria();


--
-- TOC entry 3631 (class 2620 OID 33952)
-- Name: cuentas_contables_tg_audit; Type: TRIGGER; Schema: contabilidad; Owner: postgres
--

CREATE TRIGGER cuentas_contables_tg_audit AFTER INSERT OR DELETE OR UPDATE ON cuentas_contables FOR EACH ROW EXECUTE PROCEDURE public.fun_auditoria();


--
-- TOC entry 3632 (class 2620 OID 33953)
-- Name: gasto_mes_repositorio_tg_audit; Type: TRIGGER; Schema: contabilidad; Owner: postgres
--

CREATE TRIGGER gasto_mes_repositorio_tg_audit AFTER INSERT OR DELETE OR UPDATE ON gasto_mes_repositorio FOR EACH ROW EXECUTE PROCEDURE public.fun_auditoria();


--
-- TOC entry 3633 (class 2620 OID 33954)
-- Name: gastos_impuestos_renta_deduccion_tg_audit; Type: TRIGGER; Schema: contabilidad; Owner: postgres
--

CREATE TRIGGER gastos_impuestos_renta_deduccion_tg_audit AFTER INSERT OR DELETE OR UPDATE ON gastos_impuestos_renta_deduccion FOR EACH ROW EXECUTE PROCEDURE public.fun_auditoria();


--
-- TOC entry 3634 (class 2620 OID 33955)
-- Name: genealogia_impuestos_tg_audit; Type: TRIGGER; Schema: contabilidad; Owner: postgres
--

CREATE TRIGGER genealogia_impuestos_tg_audit AFTER INSERT OR DELETE OR UPDATE ON genealogia_impuestos FOR EACH ROW EXECUTE PROCEDURE public.fun_auditoria();


--
-- TOC entry 3628 (class 2620 OID 33956)
-- Name: personas_tg_audit; Type: TRIGGER; Schema: contabilidad; Owner: postgres
--

CREATE TRIGGER personas_tg_audit AFTER INSERT OR DELETE OR UPDATE ON ambitos_impuestos FOR EACH ROW EXECUTE PROCEDURE public.fun_auditoria();


--
-- TOC entry 3635 (class 2620 OID 33957)
-- Name: personas_tg_audit; Type: TRIGGER; Schema: contabilidad; Owner: postgres
--

CREATE TRIGGER personas_tg_audit AFTER INSERT OR DELETE OR UPDATE ON grupo_impuestos FOR EACH ROW EXECUTE PROCEDURE public.fun_auditoria();


--
-- TOC entry 3636 (class 2620 OID 33958)
-- Name: personas_tg_audit; Type: TRIGGER; Schema: contabilidad; Owner: postgres
--

CREATE TRIGGER personas_tg_audit AFTER INSERT OR DELETE OR UPDATE ON impuestos FOR EACH ROW EXECUTE PROCEDURE public.fun_auditoria();


--
-- TOC entry 3638 (class 2620 OID 33959)
-- Name: tipo_documentos_tg_audit; Type: TRIGGER; Schema: contabilidad; Owner: postgres
--

CREATE TRIGGER tipo_documentos_tg_audit AFTER INSERT OR DELETE OR UPDATE ON tipo_documentos FOR EACH ROW EXECUTE PROCEDURE public.fun_auditoria();


--
-- TOC entry 3639 (class 2620 OID 33960)
-- Name: tipo_impuestos_tg_audit; Type: TRIGGER; Schema: contabilidad; Owner: postgres
--

CREATE TRIGGER tipo_impuestos_tg_audit AFTER INSERT OR DELETE OR UPDATE ON tipo_impuestos FOR EACH ROW EXECUTE PROCEDURE public.fun_auditoria();


--
-- TOC entry 3637 (class 2620 OID 33961)
-- Name: tipos_cuentas_contables_tg_audit; Type: TRIGGER; Schema: contabilidad; Owner: postgres
--

CREATE TRIGGER tipos_cuentas_contables_tg_audit AFTER INSERT OR DELETE OR UPDATE ON tipos_cuentas_contables FOR EACH ROW EXECUTE PROCEDURE public.fun_auditoria();


--
-- TOC entry 3640 (class 2620 OID 33962)
-- Name: tipos_gastos_personales_tg_audit; Type: TRIGGER; Schema: contabilidad; Owner: postgres
--

CREATE TRIGGER tipos_gastos_personales_tg_audit AFTER INSERT OR DELETE OR UPDATE ON tipos_gastos_personales FOR EACH ROW EXECUTE PROCEDURE public.fun_auditoria();


SET search_path = inventario, pg_catalog;

--
-- TOC entry 3641 (class 2620 OID 33963)
-- Name: bodegas_tg_audit; Type: TRIGGER; Schema: inventario; Owner: postgres
--

CREATE TRIGGER bodegas_tg_audit AFTER INSERT OR DELETE OR UPDATE ON bodegas FOR EACH ROW EXECUTE PROCEDURE public.fun_auditoria();


--
-- TOC entry 3643 (class 2620 OID 33964)
-- Name: personas_tg_audit; Type: TRIGGER; Schema: inventario; Owner: postgres
--

CREATE TRIGGER personas_tg_audit AFTER INSERT OR DELETE OR UPDATE ON categorias FOR EACH ROW EXECUTE PROCEDURE public.fun_auditoria();


--
-- TOC entry 3644 (class 2620 OID 33965)
-- Name: personas_tg_audit; Type: TRIGGER; Schema: inventario; Owner: postgres
--

CREATE TRIGGER personas_tg_audit AFTER INSERT OR DELETE OR UPDATE ON descripcion_producto FOR EACH ROW EXECUTE PROCEDURE public.fun_auditoria();


--
-- TOC entry 3645 (class 2620 OID 33966)
-- Name: personas_tg_audit; Type: TRIGGER; Schema: inventario; Owner: postgres
--

CREATE TRIGGER personas_tg_audit AFTER INSERT OR DELETE OR UPDATE ON estado_descriptivo FOR EACH ROW EXECUTE PROCEDURE public.fun_auditoria();


--
-- TOC entry 3646 (class 2620 OID 33967)
-- Name: personas_tg_audit; Type: TRIGGER; Schema: inventario; Owner: postgres
--

CREATE TRIGGER personas_tg_audit AFTER INSERT OR DELETE OR UPDATE ON garantias FOR EACH ROW EXECUTE PROCEDURE public.fun_auditoria();


--
-- TOC entry 3647 (class 2620 OID 33968)
-- Name: personas_tg_audit; Type: TRIGGER; Schema: inventario; Owner: postgres
--

CREATE TRIGGER personas_tg_audit AFTER INSERT OR DELETE OR UPDATE ON imagenes_productos FOR EACH ROW EXECUTE PROCEDURE public.fun_auditoria();


--
-- TOC entry 3648 (class 2620 OID 33969)
-- Name: personas_tg_audit; Type: TRIGGER; Schema: inventario; Owner: postgres
--

CREATE TRIGGER personas_tg_audit AFTER INSERT OR DELETE OR UPDATE ON marcas FOR EACH ROW EXECUTE PROCEDURE public.fun_auditoria();


--
-- TOC entry 3649 (class 2620 OID 33970)
-- Name: personas_tg_audit; Type: TRIGGER; Schema: inventario; Owner: postgres
--

CREATE TRIGGER personas_tg_audit AFTER INSERT OR DELETE OR UPDATE ON modelos FOR EACH ROW EXECUTE PROCEDURE public.fun_auditoria();


--
-- TOC entry 3652 (class 2620 OID 33971)
-- Name: personas_tg_audit; Type: TRIGGER; Schema: inventario; Owner: postgres
--

CREATE TRIGGER personas_tg_audit AFTER INSERT OR DELETE OR UPDATE ON proveedores FOR EACH ROW EXECUTE PROCEDURE public.fun_auditoria();


--
-- TOC entry 3656 (class 2620 OID 33972)
-- Name: personas_tg_audit; Type: TRIGGER; Schema: inventario; Owner: postgres
--

CREATE TRIGGER personas_tg_audit AFTER INSERT OR DELETE OR UPDATE ON tipos_categorias FOR EACH ROW EXECUTE PROCEDURE public.fun_auditoria();


--
-- TOC entry 3657 (class 2620 OID 33973)
-- Name: personas_tg_audit; Type: TRIGGER; Schema: inventario; Owner: postgres
--

CREATE TRIGGER personas_tg_audit AFTER INSERT OR DELETE OR UPDATE ON tipos_garantias FOR EACH ROW EXECUTE PROCEDURE public.fun_auditoria();


--
-- TOC entry 3658 (class 2620 OID 33974)
-- Name: personas_tg_audit; Type: TRIGGER; Schema: inventario; Owner: postgres
--

CREATE TRIGGER personas_tg_audit AFTER INSERT OR DELETE OR UPDATE ON tipos_imagenes_productos FOR EACH ROW EXECUTE PROCEDURE public.fun_auditoria();


--
-- TOC entry 3659 (class 2620 OID 33975)
-- Name: personas_tg_audit; Type: TRIGGER; Schema: inventario; Owner: postgres
--

CREATE TRIGGER personas_tg_audit AFTER INSERT OR DELETE OR UPDATE ON tipos_productos FOR EACH ROW EXECUTE PROCEDURE public.fun_auditoria();


--
-- TOC entry 3654 (class 2620 OID 33976)
-- Name: personas_tg_audit; Type: TRIGGER; Schema: inventario; Owner: postgres
--

CREATE TRIGGER personas_tg_audit AFTER INSERT OR DELETE OR UPDATE ON tipos_catalogos FOR EACH ROW EXECUTE PROCEDURE public.fun_auditoria();


--
-- TOC entry 3642 (class 2620 OID 33977)
-- Name: personas_tg_audit; Type: TRIGGER; Schema: inventario; Owner: postgres
--

CREATE TRIGGER personas_tg_audit AFTER INSERT OR DELETE OR UPDATE ON catalogos FOR EACH ROW EXECUTE PROCEDURE public.fun_auditoria();


--
-- TOC entry 3651 (class 2620 OID 33978)
-- Name: productos_impuestos_tg_audit; Type: TRIGGER; Schema: inventario; Owner: postgres
--

CREATE TRIGGER productos_impuestos_tg_audit AFTER INSERT OR DELETE OR UPDATE ON productos_impuestos FOR EACH ROW EXECUTE PROCEDURE public.fun_auditoria();


--
-- TOC entry 3650 (class 2620 OID 33979)
-- Name: productos_tg_audit; Type: TRIGGER; Schema: inventario; Owner: postgres
--

CREATE TRIGGER productos_tg_audit AFTER INSERT OR DELETE OR UPDATE ON productos FOR EACH ROW EXECUTE PROCEDURE public.fun_auditoria();


--
-- TOC entry 3653 (class 2620 OID 33980)
-- Name: tipo_consumo_tg_audit; Type: TRIGGER; Schema: inventario; Owner: postgres
--

CREATE TRIGGER tipo_consumo_tg_audit AFTER INSERT OR DELETE OR UPDATE ON tipo_consumo FOR EACH ROW EXECUTE PROCEDURE public.fun_auditoria();


--
-- TOC entry 3655 (class 2620 OID 33981)
-- Name: tipos_catalogos_tg_audit; Type: TRIGGER; Schema: inventario; Owner: postgres
--

CREATE TRIGGER tipos_catalogos_tg_audit AFTER INSERT OR DELETE OR UPDATE ON tipos_catalogos FOR EACH ROW EXECUTE PROCEDURE public.fun_auditoria();


--
-- TOC entry 3660 (class 2620 OID 33982)
-- Name: tipos_tipo_consumo_tg_audit; Type: TRIGGER; Schema: inventario; Owner: postgres
--

CREATE TRIGGER tipos_tipo_consumo_tg_audit AFTER INSERT OR DELETE OR UPDATE ON tipos_tipo_consumo FOR EACH ROW EXECUTE PROCEDURE public.fun_auditoria();


--
-- TOC entry 3661 (class 2620 OID 33983)
-- Name: ubicaciones_tg_audit; Type: TRIGGER; Schema: inventario; Owner: postgres
--

CREATE TRIGGER ubicaciones_tg_audit AFTER INSERT OR DELETE OR UPDATE ON ubicaciones FOR EACH ROW EXECUTE PROCEDURE public.fun_auditoria();


SET search_path = public, pg_catalog;

--
-- TOC entry 3662 (class 2620 OID 33984)
-- Name: estados_tg_audit; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER estados_tg_audit AFTER INSERT OR DELETE OR UPDATE ON estados FOR EACH ROW EXECUTE PROCEDURE fun_auditoria();


--
-- TOC entry 3666 (class 2620 OID 33985)
-- Name: inserta_cliente_tg_usuario; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER inserta_cliente_tg_usuario AFTER INSERT OR DELETE OR UPDATE ON personas_documentos_identificacion FOR EACH ROW EXECUTE PROCEDURE fun_cliente_persona();


--
-- TOC entry 3663 (class 2620 OID 33986)
-- Name: operadoras_telefonicas_tg_audit; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER operadoras_telefonicas_tg_audit AFTER INSERT OR DELETE OR UPDATE ON operadoras_telefonicas FOR EACH ROW EXECUTE PROCEDURE fun_auditoria();


--
-- TOC entry 3665 (class 2620 OID 33987)
-- Name: personas_correo_electronico_tg_audit; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER personas_correo_electronico_tg_audit AFTER INSERT OR DELETE OR UPDATE ON personas_correo_electronico FOR EACH ROW EXECUTE PROCEDURE fun_auditoria();


--
-- TOC entry 3667 (class 2620 OID 33988)
-- Name: personas_documentos_identificacion_tg_audit; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER personas_documentos_identificacion_tg_audit AFTER INSERT OR DELETE OR UPDATE ON personas_documentos_identificacion FOR EACH ROW EXECUTE PROCEDURE fun_auditoria();


--
-- TOC entry 3664 (class 2620 OID 33989)
-- Name: personas_tg_audit; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER personas_tg_audit AFTER INSERT OR DELETE OR UPDATE ON personas FOR EACH ROW EXECUTE PROCEDURE fun_auditoria();


--
-- TOC entry 3668 (class 2620 OID 33990)
-- Name: telefonos_personas_tg_audit; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER telefonos_personas_tg_audit AFTER INSERT OR DELETE OR UPDATE ON telefonos_personas FOR EACH ROW EXECUTE PROCEDURE fun_auditoria();


--
-- TOC entry 3669 (class 2620 OID 33991)
-- Name: tipo_documento_identificacion_tg_audit; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER tipo_documento_identificacion_tg_audit AFTER INSERT OR DELETE OR UPDATE ON tipo_documento_identificacion FOR EACH ROW EXECUTE PROCEDURE fun_auditoria();


SET search_path = talento_humano, pg_catalog;

--
-- TOC entry 3671 (class 2620 OID 33992)
-- Name: cargos_tg_audit; Type: TRIGGER; Schema: talento_humano; Owner: postgres
--

CREATE TRIGGER cargos_tg_audit AFTER INSERT OR DELETE OR UPDATE ON cargos FOR EACH ROW EXECUTE PROCEDURE public.fun_auditoria();


--
-- TOC entry 3672 (class 2620 OID 33993)
-- Name: empleados_tg_audit; Type: TRIGGER; Schema: talento_humano; Owner: postgres
--

CREATE TRIGGER empleados_tg_audit AFTER INSERT OR DELETE OR UPDATE ON empleados FOR EACH ROW EXECUTE PROCEDURE public.fun_auditoria();


--
-- TOC entry 3673 (class 2620 OID 33994)
-- Name: jornadas_de_trabajo_tg_audit; Type: TRIGGER; Schema: talento_humano; Owner: postgres
--

CREATE TRIGGER jornadas_de_trabajo_tg_audit AFTER INSERT OR DELETE OR UPDATE ON jornadas_de_trabajo FOR EACH ROW EXECUTE PROCEDURE public.fun_auditoria();


--
-- TOC entry 3674 (class 2620 OID 33995)
-- Name: tipo_usuario_tg_audit; Type: TRIGGER; Schema: talento_humano; Owner: postgres
--

CREATE TRIGGER tipo_usuario_tg_audit AFTER INSERT OR DELETE OR UPDATE ON tipos_contratos FOR EACH ROW EXECUTE PROCEDURE public.fun_auditoria();


--
-- TOC entry 3675 (class 2620 OID 33996)
-- Name: tipos_contratos_tg_audit; Type: TRIGGER; Schema: talento_humano; Owner: postgres
--

CREATE TRIGGER tipos_contratos_tg_audit AFTER INSERT OR DELETE OR UPDATE ON tipos_contratos FOR EACH ROW EXECUTE PROCEDURE public.fun_auditoria();


SET search_path = usuarios, pg_catalog;

--
-- TOC entry 3676 (class 2620 OID 33997)
-- Name: tipo_usuario_tg_audit; Type: TRIGGER; Schema: usuarios; Owner: postgres
--

CREATE TRIGGER tipo_usuario_tg_audit AFTER INSERT OR DELETE OR UPDATE ON tipo_usuario FOR EACH ROW EXECUTE PROCEDURE public.fun_auditoria();


--
-- TOC entry 3677 (class 2620 OID 33998)
-- Name: usuarios_tg_audit; Type: TRIGGER; Schema: usuarios; Owner: postgres
--

CREATE TRIGGER usuarios_tg_audit AFTER INSERT OR DELETE OR UPDATE ON usuarios FOR EACH ROW EXECUTE PROCEDURE public.fun_auditoria();


SET search_path = ventas, pg_catalog;

--
-- TOC entry 3678 (class 2620 OID 33999)
-- Name: caja_tg_audit; Type: TRIGGER; Schema: ventas; Owner: postgres
--

CREATE TRIGGER caja_tg_audit AFTER INSERT OR DELETE OR UPDATE ON caja FOR EACH ROW EXECUTE PROCEDURE public.fun_auditoria();


--
-- TOC entry 3679 (class 2620 OID 34000)
-- Name: caja_usuario_tg_audit; Type: TRIGGER; Schema: ventas; Owner: postgres
--

CREATE TRIGGER caja_usuario_tg_audit AFTER INSERT OR DELETE OR UPDATE ON caja_usuario FOR EACH ROW EXECUTE PROCEDURE public.fun_auditoria();


--
-- TOC entry 3680 (class 2620 OID 34001)
-- Name: clave_factura_tg_audit; Type: TRIGGER; Schema: ventas; Owner: postgres
--

CREATE TRIGGER clave_factura_tg_audit AFTER INSERT OR DELETE OR UPDATE ON clave_factura FOR EACH ROW EXECUTE PROCEDURE public.fun_auditoria();


--
-- TOC entry 3681 (class 2620 OID 34002)
-- Name: detalle_factura_tg_audit; Type: TRIGGER; Schema: ventas; Owner: postgres
--

CREATE TRIGGER detalle_factura_tg_audit AFTER INSERT OR DELETE OR UPDATE ON detalle_factura FOR EACH ROW EXECUTE PROCEDURE public.fun_auditoria();


--
-- TOC entry 3682 (class 2620 OID 34003)
-- Name: empleado_factura_tg_audit; Type: TRIGGER; Schema: ventas; Owner: postgres
--

CREATE TRIGGER empleado_factura_tg_audit AFTER INSERT OR DELETE OR UPDATE ON empleado_factura FOR EACH ROW EXECUTE PROCEDURE public.fun_auditoria();


--
-- TOC entry 3683 (class 2620 OID 34004)
-- Name: facturas_tg_audit; Type: TRIGGER; Schema: ventas; Owner: postgres
--

CREATE TRIGGER facturas_tg_audit AFTER INSERT OR DELETE OR UPDATE ON facturas FOR EACH ROW EXECUTE PROCEDURE public.fun_auditoria();


--
-- TOC entry 3684 (class 2620 OID 34005)
-- Name: formas_pago_facturas_tg_audit; Type: TRIGGER; Schema: ventas; Owner: postgres
--

CREATE TRIGGER formas_pago_facturas_tg_audit AFTER INSERT OR DELETE OR UPDATE ON formas_pago_facturas FOR EACH ROW EXECUTE PROCEDURE public.fun_auditoria();


--
-- TOC entry 3670 (class 2620 OID 34006)
-- Name: formas_pago_tg_audit; Type: TRIGGER; Schema: ventas; Owner: postgres
--

CREATE TRIGGER formas_pago_tg_audit AFTER INSERT OR DELETE OR UPDATE ON formas_pago FOR EACH ROW EXECUTE PROCEDURE public.fun_auditoria();


--
-- TOC entry 3685 (class 2620 OID 34007)
-- Name: producto_descuento_tg_audit; Type: TRIGGER; Schema: ventas; Owner: postgres
--

CREATE TRIGGER producto_descuento_tg_audit AFTER INSERT OR DELETE OR UPDATE ON producto_descuento FOR EACH ROW EXECUTE PROCEDURE public.fun_auditoria();


SET search_path = "Taller_mecanico", pg_catalog;

--
-- TOC entry 3532 (class 2606 OID 34008)
-- Name: Empresa_aseguradora_FK; Type: FK CONSTRAINT; Schema: Taller_mecanico; Owner: postgres
--

ALTER TABLE ONLY "Aseguradora"
    ADD CONSTRAINT "Empresa_aseguradora_FK" FOREIGN KEY (id_empresa) REFERENCES administracion.empresas(id);


SET search_path = administracion, pg_catalog;

--
-- TOC entry 3540 (class 2606 OID 34013)
-- Name: estado; Type: FK CONSTRAINT; Schema: administracion; Owner: postgres
--

ALTER TABLE ONLY tipo_empresa
    ADD CONSTRAINT estado FOREIGN KEY (estado) REFERENCES public.estados(id);


--
-- TOC entry 3535 (class 2606 OID 34018)
-- Name: estado; Type: FK CONSTRAINT; Schema: administracion; Owner: postgres
--

ALTER TABLE ONLY clientes
    ADD CONSTRAINT estado FOREIGN KEY (estado) REFERENCES public.estados(id);


--
-- TOC entry 3539 (class 2606 OID 34023)
-- Name: estado_FK; Type: FK CONSTRAINT; Schema: administracion; Owner: postgres
--

ALTER TABLE ONLY tipo_bienes_servicios
    ADD CONSTRAINT "estado_FK" FOREIGN KEY (estado) REFERENCES public.estados(id);


--
-- TOC entry 3533 (class 2606 OID 34028)
-- Name: estado_FK; Type: FK CONSTRAINT; Schema: administracion; Owner: postgres
--

ALTER TABLE ONLY actividad_economica
    ADD CONSTRAINT "estado_FK" FOREIGN KEY (estado) REFERENCES public.estados(id);


--
-- TOC entry 3542 (class 2606 OID 34033)
-- Name: estado_FK; Type: FK CONSTRAINT; Schema: administracion; Owner: postgres
--

ALTER TABLE ONLY usuarios_privilegios
    ADD CONSTRAINT "estado_FK" FOREIGN KEY (estado) REFERENCES public.estados(id);


--
-- TOC entry 3541 (class 2606 OID 34038)
-- Name: estado_FK; Type: FK CONSTRAINT; Schema: administracion; Owner: postgres
--

ALTER TABLE ONLY tipos_imagenes_empresas
    ADD CONSTRAINT "estado_FK" FOREIGN KEY (estado) REFERENCES public.estados(id);


--
-- TOC entry 3536 (class 2606 OID 34043)
-- Name: estado_empresa_FK; Type: FK CONSTRAINT; Schema: administracion; Owner: postgres
--

ALTER TABLE ONLY empresas
    ADD CONSTRAINT "estado_empresa_FK" FOREIGN KEY (id_estado) REFERENCES public.estados(id);


--
-- TOC entry 3537 (class 2606 OID 34048)
-- Name: imagen_empresa_estado_FK; Type: FK CONSTRAINT; Schema: administracion; Owner: postgres
--

ALTER TABLE ONLY imagen_empresa
    ADD CONSTRAINT "imagen_empresa_estado_FK" FOREIGN KEY (estado) REFERENCES public.estados(id);


--
-- TOC entry 3534 (class 2606 OID 34053)
-- Name: tipo_bienes_servicios_FK; Type: FK CONSTRAINT; Schema: administracion; Owner: postgres
--

ALTER TABLE ONLY actividad_economica
    ADD CONSTRAINT "tipo_bienes_servicios_FK" FOREIGN KEY (id_tipo_bienes_servicios) REFERENCES tipo_bienes_servicios(id);


--
-- TOC entry 3538 (class 2606 OID 34058)
-- Name: tipo_imagen_empresa_FK; Type: FK CONSTRAINT; Schema: administracion; Owner: postgres
--

ALTER TABLE ONLY imagen_empresa
    ADD CONSTRAINT "tipo_imagen_empresa_FK" FOREIGN KEY (tipo_imagen) REFERENCES tipos_imagenes_empresas(id);


--
-- TOC entry 3543 (class 2606 OID 34063)
-- Name: usuario_privilegios_tipo_accion_vista_FK; Type: FK CONSTRAINT; Schema: administracion; Owner: postgres
--

ALTER TABLE ONLY usuarios_privilegios
    ADD CONSTRAINT "usuario_privilegios_tipo_accion_vista_FK" FOREIGN KEY (id_tipo_accion_vistas) REFERENCES tipo_accion_vista(id);


--
-- TOC entry 3544 (class 2606 OID 34068)
-- Name: usuario_privilegios_tipo_usuario_FK; Type: FK CONSTRAINT; Schema: administracion; Owner: postgres
--

ALTER TABLE ONLY usuarios_privilegios
    ADD CONSTRAINT "usuario_privilegios_tipo_usuario_FK" FOREIGN KEY (id_tipo_usuario) REFERENCES usuarios.tipo_usuario(id);


SET search_path = contabilidad, pg_catalog;

--
-- TOC entry 3556 (class 2606 OID 34073)
-- Name: ambito_FK; Type: FK CONSTRAINT; Schema: contabilidad; Owner: postgres
--

ALTER TABLE ONLY impuestos
    ADD CONSTRAINT "ambito_FK" FOREIGN KEY (ambito) REFERENCES ambitos_impuestos(id);


--
-- TOC entry 3555 (class 2606 OID 34078)
-- Name: estado_FK; Type: FK CONSTRAINT; Schema: contabilidad; Owner: postgres
--

ALTER TABLE ONLY grupo_impuestos
    ADD CONSTRAINT "estado_FK" FOREIGN KEY (estado) REFERENCES public.estados(id);


--
-- TOC entry 3545 (class 2606 OID 34083)
-- Name: estado_FK; Type: FK CONSTRAINT; Schema: contabilidad; Owner: postgres
--

ALTER TABLE ONLY ambitos_impuestos
    ADD CONSTRAINT "estado_FK" FOREIGN KEY (estado) REFERENCES public.estados(id);


--
-- TOC entry 3557 (class 2606 OID 34088)
-- Name: estado_FK; Type: FK CONSTRAINT; Schema: contabilidad; Owner: postgres
--

ALTER TABLE ONLY impuestos
    ADD CONSTRAINT "estado_FK" FOREIGN KEY (estado) REFERENCES public.estados(id);


--
-- TOC entry 3546 (class 2606 OID 34093)
-- Name: estado_asiento_contable_FK; Type: FK CONSTRAINT; Schema: contabilidad; Owner: postgres
--

ALTER TABLE ONLY asientos_contables_diario
    ADD CONSTRAINT "estado_asiento_contable_FK" FOREIGN KEY (estado) REFERENCES public.estados(id);


--
-- TOC entry 3547 (class 2606 OID 34098)
-- Name: estado_bancos_FK; Type: FK CONSTRAINT; Schema: contabilidad; Owner: postgres
--

ALTER TABLE ONLY bancos
    ADD CONSTRAINT "estado_bancos_FK" FOREIGN KEY (estado) REFERENCES public.estados(id);


--
-- TOC entry 3559 (class 2606 OID 34103)
-- Name: estado_factura; Type: FK CONSTRAINT; Schema: contabilidad; Owner: postgres
--

ALTER TABLE ONLY repositorio_facturas
    ADD CONSTRAINT estado_factura FOREIGN KEY (estado) REFERENCES public.estados(id);


--
-- TOC entry 3550 (class 2606 OID 34108)
-- Name: estado_pago; Type: FK CONSTRAINT; Schema: contabilidad; Owner: postgres
--

ALTER TABLE ONLY finaciaminto
    ADD CONSTRAINT estado_pago FOREIGN KEY (estado_pago) REFERENCES public.estados(id);


--
-- TOC entry 3563 (class 2606 OID 34113)
-- Name: estado_tipo_cuenta_contable_FK; Type: FK CONSTRAINT; Schema: contabilidad; Owner: postgres
--

ALTER TABLE ONLY tipos_cuentas_contables
    ADD CONSTRAINT "estado_tipo_cuenta_contable_FK" FOREIGN KEY (estado) REFERENCES public.estados(id);


--
-- TOC entry 3564 (class 2606 OID 34118)
-- Name: estado_tipo_documento_FK; Type: FK CONSTRAINT; Schema: contabilidad; Owner: postgres
--

ALTER TABLE ONLY tipo_documentos
    ADD CONSTRAINT "estado_tipo_documento_FK" FOREIGN KEY (estado) REFERENCES public.estados(id);


--
-- TOC entry 3565 (class 2606 OID 34123)
-- Name: estado_tipo_impuesto_FK; Type: FK CONSTRAINT; Schema: contabilidad; Owner: postgres
--

ALTER TABLE ONLY tipo_impuestos
    ADD CONSTRAINT "estado_tipo_impuesto_FK" FOREIGN KEY (estado) REFERENCES public.estados(id);


--
-- TOC entry 3560 (class 2606 OID 34128)
-- Name: estado_ver_factura; Type: FK CONSTRAINT; Schema: contabilidad; Owner: postgres
--

ALTER TABLE ONLY repositorio_facturas
    ADD CONSTRAINT estado_ver_factura FOREIGN KEY (estado_view) REFERENCES public.estados(id);


--
-- TOC entry 3551 (class 2606 OID 34133)
-- Name: factura_finaciamiento_FK; Type: FK CONSTRAINT; Schema: contabilidad; Owner: postgres
--

ALTER TABLE ONLY finaciaminto
    ADD CONSTRAINT "factura_finaciamiento_FK" FOREIGN KEY (id_factura) REFERENCES ventas.facturas(id);


--
-- TOC entry 3553 (class 2606 OID 34138)
-- Name: gastos_impueto_renta_deducion_estado; Type: FK CONSTRAINT; Schema: contabilidad; Owner: postgres
--

ALTER TABLE ONLY gastos_impuestos_renta_deduccion
    ADD CONSTRAINT gastos_impueto_renta_deducion_estado FOREIGN KEY (estado) REFERENCES public.estados(id);


--
-- TOC entry 3554 (class 2606 OID 34143)
-- Name: gastos_impueto_renta_deducion_factura; Type: FK CONSTRAINT; Schema: contabilidad; Owner: postgres
--

ALTER TABLE ONLY gastos_impuestos_renta_deduccion
    ADD CONSTRAINT gastos_impueto_renta_deducion_factura FOREIGN KEY (id_factura) REFERENCES repositorio_facturas(id_factura);


--
-- TOC entry 3562 (class 2606 OID 34148)
-- Name: id_empleasdo_FK; Type: FK CONSTRAINT; Schema: contabilidad; Owner: postgres
--

ALTER TABLE ONLY rol_pagos_empleados
    ADD CONSTRAINT "id_empleasdo_FK" FOREIGN KEY (id_empleado) REFERENCES talento_humano.empleados(id);


--
-- TOC entry 3548 (class 2606 OID 34153)
-- Name: persona_bancos_FK; Type: FK CONSTRAINT; Schema: contabilidad; Owner: postgres
--

ALTER TABLE ONLY bancos
    ADD CONSTRAINT "persona_bancos_FK" FOREIGN KEY (titular_cuenta) REFERENCES public.personas(id);


--
-- TOC entry 3552 (class 2606 OID 34158)
-- Name: plazos_credito_FK; Type: FK CONSTRAINT; Schema: contabilidad; Owner: postgres
--

ALTER TABLE ONLY finaciaminto
    ADD CONSTRAINT "plazos_credito_FK" FOREIGN KEY (id_plazos_credito) REFERENCES plazos_credito(id);


--
-- TOC entry 3561 (class 2606 OID 34163)
-- Name: repositorio_facturas_rechazadas_estado_fkey; Type: FK CONSTRAINT; Schema: contabilidad; Owner: postgres
--

ALTER TABLE ONLY repositorio_facturas_rechazadas
    ADD CONSTRAINT repositorio_facturas_rechazadas_estado_fkey FOREIGN KEY (estado) REFERENCES public.estados(id);


--
-- TOC entry 3549 (class 2606 OID 34168)
-- Name: tipo_cuenta_cuentas_contables_FK; Type: FK CONSTRAINT; Schema: contabilidad; Owner: postgres
--

ALTER TABLE ONLY cuentas_contables
    ADD CONSTRAINT "tipo_cuenta_cuentas_contables_FK" FOREIGN KEY (tipo_cuenta) REFERENCES tipos_cuentas_contables(id);


--
-- TOC entry 3558 (class 2606 OID 34173)
-- Name: tipo_impuesto; Type: FK CONSTRAINT; Schema: contabilidad; Owner: postgres
--

ALTER TABLE ONLY impuestos
    ADD CONSTRAINT tipo_impuesto FOREIGN KEY (tipo_impuesto) REFERENCES tipo_impuestos(id);


SET search_path = inventario, pg_catalog;

--
-- TOC entry 3581 (class 2606 OID 34178)
-- Name: bodega_FK; Type: FK CONSTRAINT; Schema: inventario; Owner: postgres
--

ALTER TABLE ONLY productos
    ADD CONSTRAINT "bodega_FK" FOREIGN KEY (bodega) REFERENCES bodegas(id);


--
-- TOC entry 3582 (class 2606 OID 34183)
-- Name: categoria_FK; Type: FK CONSTRAINT; Schema: inventario; Owner: postgres
--

ALTER TABLE ONLY productos
    ADD CONSTRAINT "categoria_FK" FOREIGN KEY (categoria) REFERENCES categorias(id);


--
-- TOC entry 3593 (class 2606 OID 34188)
-- Name: estado_FK; Type: FK CONSTRAINT; Schema: inventario; Owner: postgres
--

ALTER TABLE ONLY tipos_imagenes_productos
    ADD CONSTRAINT "estado_FK" FOREIGN KEY (estado) REFERENCES public.estados(id);


--
-- TOC entry 3574 (class 2606 OID 34193)
-- Name: estado_FK; Type: FK CONSTRAINT; Schema: inventario; Owner: postgres
--

ALTER TABLE ONLY imagenes_productos
    ADD CONSTRAINT "estado_FK" FOREIGN KEY (estado) REFERENCES public.estados(id);


--
-- TOC entry 3572 (class 2606 OID 34198)
-- Name: estado_FK; Type: FK CONSTRAINT; Schema: inventario; Owner: postgres
--

ALTER TABLE ONLY garantias
    ADD CONSTRAINT "estado_FK" FOREIGN KEY (estado) REFERENCES public.estados(id);


--
-- TOC entry 3591 (class 2606 OID 34203)
-- Name: estado_FK; Type: FK CONSTRAINT; Schema: inventario; Owner: postgres
--

ALTER TABLE ONLY tipos_categorias
    ADD CONSTRAINT "estado_FK" FOREIGN KEY (estado) REFERENCES public.estados(id);


--
-- TOC entry 3579 (class 2606 OID 34208)
-- Name: estado_FK; Type: FK CONSTRAINT; Schema: inventario; Owner: postgres
--

ALTER TABLE ONLY marcas
    ADD CONSTRAINT "estado_FK" FOREIGN KEY (estado) REFERENCES public.estados(id);


--
-- TOC entry 3580 (class 2606 OID 34213)
-- Name: estado_FK; Type: FK CONSTRAINT; Schema: inventario; Owner: postgres
--

ALTER TABLE ONLY modelos
    ADD CONSTRAINT "estado_FK" FOREIGN KEY (estado) REFERENCES public.estados(id);


--
-- TOC entry 3571 (class 2606 OID 34218)
-- Name: estado_FK; Type: FK CONSTRAINT; Schema: inventario; Owner: postgres
--

ALTER TABLE ONLY estado_descriptivo
    ADD CONSTRAINT "estado_FK" FOREIGN KEY (estado) REFERENCES public.estados(id);


--
-- TOC entry 3594 (class 2606 OID 34223)
-- Name: estado_FK; Type: FK CONSTRAINT; Schema: inventario; Owner: postgres
--

ALTER TABLE ONLY tipos_productos
    ADD CONSTRAINT "estado_FK" FOREIGN KEY (estado) REFERENCES public.estados(id);


--
-- TOC entry 3590 (class 2606 OID 34228)
-- Name: estado_FK; Type: FK CONSTRAINT; Schema: inventario; Owner: postgres
--

ALTER TABLE ONLY tipos_catalogos
    ADD CONSTRAINT "estado_FK" FOREIGN KEY (estado) REFERENCES public.estados(id);


--
-- TOC entry 3595 (class 2606 OID 34233)
-- Name: estado_FK; Type: FK CONSTRAINT; Schema: inventario; Owner: postgres
--

ALTER TABLE ONLY tipos_tipo_consumo
    ADD CONSTRAINT "estado_FK" FOREIGN KEY (estado) REFERENCES public.estados(id);


--
-- TOC entry 3596 (class 2606 OID 34238)
-- Name: estado_FK; Type: FK CONSTRAINT; Schema: inventario; Owner: postgres
--

ALTER TABLE ONLY ubicaciones
    ADD CONSTRAINT "estado_FK" FOREIGN KEY (estado) REFERENCES public.estados(id);


--
-- TOC entry 3577 (class 2606 OID 34243)
-- Name: estado_FK; Type: FK CONSTRAINT; Schema: inventario; Owner: postgres
--

ALTER TABLE ONLY manejo_presios
    ADD CONSTRAINT "estado_FK" FOREIGN KEY (estado) REFERENCES public.estados(id);


--
-- TOC entry 3566 (class 2606 OID 34248)
-- Name: estado_bodega_FK; Type: FK CONSTRAINT; Schema: inventario; Owner: postgres
--

ALTER TABLE ONLY bodegas
    ADD CONSTRAINT "estado_bodega_FK" FOREIGN KEY (estado) REFERENCES public.estados(id);


--
-- TOC entry 3583 (class 2606 OID 34253)
-- Name: estado_descriptivo_FK; Type: FK CONSTRAINT; Schema: inventario; Owner: postgres
--

ALTER TABLE ONLY productos
    ADD CONSTRAINT "estado_descriptivo_FK" FOREIGN KEY (estado_descriptivo) REFERENCES estado_descriptivo(id);


--
-- TOC entry 3592 (class 2606 OID 34258)
-- Name: estados; Type: FK CONSTRAINT; Schema: inventario; Owner: postgres
--

ALTER TABLE ONLY tipos_garantias
    ADD CONSTRAINT estados FOREIGN KEY (estado) REFERENCES public.estados(id);


--
-- TOC entry 3584 (class 2606 OID 34263)
-- Name: garantia_FK; Type: FK CONSTRAINT; Schema: inventario; Owner: postgres
--

ALTER TABLE ONLY productos
    ADD CONSTRAINT "garantia_FK" FOREIGN KEY (garantia) REFERENCES garantias(id);


--
-- TOC entry 3567 (class 2606 OID 34268)
-- Name: giro_negocio_FK; Type: FK CONSTRAINT; Schema: inventario; Owner: postgres
--

ALTER TABLE ONLY bodegas
    ADD CONSTRAINT "giro_negocio_FK" FOREIGN KEY (giro_negocio) REFERENCES administracion.tipo_bienes_servicios(id);


--
-- TOC entry 3570 (class 2606 OID 34273)
-- Name: id_producto; Type: FK CONSTRAINT; Schema: inventario; Owner: postgres
--

ALTER TABLE ONLY descripcion_producto
    ADD CONSTRAINT id_producto FOREIGN KEY (producto) REFERENCES productos(id);


--
-- TOC entry 3578 (class 2606 OID 34278)
-- Name: id_producto; Type: FK CONSTRAINT; Schema: inventario; Owner: postgres
--

ALTER TABLE ONLY manejo_presios
    ADD CONSTRAINT id_producto FOREIGN KEY (id_producto) REFERENCES productos(id);


--
-- TOC entry 3575 (class 2606 OID 34283)
-- Name: id_producto_FK; Type: FK CONSTRAINT; Schema: inventario; Owner: postgres
--

ALTER TABLE ONLY imagenes_productos
    ADD CONSTRAINT "id_producto_FK" FOREIGN KEY (producto) REFERENCES productos(id);


--
-- TOC entry 3589 (class 2606 OID 34288)
-- Name: impuesto_FK; Type: FK CONSTRAINT; Schema: inventario; Owner: postgres
--

ALTER TABLE ONLY productos_impuestos
    ADD CONSTRAINT "impuesto_FK" FOREIGN KEY (impuesto) REFERENCES contabilidad.impuestos(id);


--
-- TOC entry 3585 (class 2606 OID 34293)
-- Name: marca_FK; Type: FK CONSTRAINT; Schema: inventario; Owner: postgres
--

ALTER TABLE ONLY productos
    ADD CONSTRAINT "marca_FK" FOREIGN KEY (marca) REFERENCES marcas(id);


--
-- TOC entry 3586 (class 2606 OID 34298)
-- Name: modelo_FK; Type: FK CONSTRAINT; Schema: inventario; Owner: postgres
--

ALTER TABLE ONLY productos
    ADD CONSTRAINT "modelo_FK" FOREIGN KEY (modelo) REFERENCES modelos(id);


--
-- TOC entry 3587 (class 2606 OID 34303)
-- Name: producto_tipo_consumo_FK; Type: FK CONSTRAINT; Schema: inventario; Owner: postgres
--

ALTER TABLE ONLY productos
    ADD CONSTRAINT "producto_tipo_consumo_FK" FOREIGN KEY (tipo_consumo) REFERENCES tipo_consumo(id);


--
-- TOC entry 3568 (class 2606 OID 34308)
-- Name: tipo_catalogo_FK; Type: FK CONSTRAINT; Schema: inventario; Owner: postgres
--

ALTER TABLE ONLY catalogos
    ADD CONSTRAINT "tipo_catalogo_FK" FOREIGN KEY (tipo_catalogo) REFERENCES tipos_catalogos(id);


--
-- TOC entry 3569 (class 2606 OID 34313)
-- Name: tipo_categoria_FK; Type: FK CONSTRAINT; Schema: inventario; Owner: postgres
--

ALTER TABLE ONLY categorias
    ADD CONSTRAINT "tipo_categoria_FK" FOREIGN KEY (tipo_categoria) REFERENCES tipos_categorias(id);


--
-- TOC entry 3573 (class 2606 OID 34318)
-- Name: tipo_garantia_FK; Type: FK CONSTRAINT; Schema: inventario; Owner: postgres
--

ALTER TABLE ONLY garantias
    ADD CONSTRAINT "tipo_garantia_FK" FOREIGN KEY (tipo_garantia) REFERENCES tipos_garantias(id);


--
-- TOC entry 3576 (class 2606 OID 34323)
-- Name: tipo_imagen_producto; Type: FK CONSTRAINT; Schema: inventario; Owner: postgres
--

ALTER TABLE ONLY imagenes_productos
    ADD CONSTRAINT tipo_imagen_producto FOREIGN KEY (tipo_imagen) REFERENCES tipos_imagenes_productos(id);


--
-- TOC entry 3588 (class 2606 OID 34328)
-- Name: ubicacion_FK; Type: FK CONSTRAINT; Schema: inventario; Owner: postgres
--

ALTER TABLE ONLY productos
    ADD CONSTRAINT "ubicacion_FK" FOREIGN KEY (ubicacion) REFERENCES ubicaciones(id);


SET search_path = public, pg_catalog;

--
-- TOC entry 3604 (class 2606 OID 34333)
-- Name: estado_FK; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY tipo_documento_identificacion
    ADD CONSTRAINT "estado_FK" FOREIGN KEY (estado) REFERENCES estados(id);


--
-- TOC entry 3597 (class 2606 OID 34338)
-- Name: estado_FK; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY operadoras_telefonicas
    ADD CONSTRAINT "estado_FK" FOREIGN KEY (estado) REFERENCES estados(id);


--
-- TOC entry 3599 (class 2606 OID 34343)
-- Name: estado_FK; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY personas_documentos_identificacion
    ADD CONSTRAINT "estado_FK" FOREIGN KEY (estado) REFERENCES estados(id);


--
-- TOC entry 3598 (class 2606 OID 34348)
-- Name: estado_FK; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY personas_correo_electronico
    ADD CONSTRAINT "estado_FK" FOREIGN KEY (estado) REFERENCES estados(id);


--
-- TOC entry 3602 (class 2606 OID 34353)
-- Name: id_persona_FK; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY telefonos_personas
    ADD CONSTRAINT "id_persona_FK" FOREIGN KEY (id_persona) REFERENCES personas(id);


--
-- TOC entry 3600 (class 2606 OID 34358)
-- Name: persona_FK; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY personas_documentos_identificacion
    ADD CONSTRAINT "persona_FK" FOREIGN KEY (id_persona) REFERENCES personas(id);


--
-- TOC entry 3603 (class 2606 OID 34363)
-- Name: telefonos_personas_operadora_telefocnica_FK; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY telefonos_personas
    ADD CONSTRAINT "telefonos_personas_operadora_telefocnica_FK" FOREIGN KEY (id_operadora_telefonica) REFERENCES operadoras_telefonicas(id);


--
-- TOC entry 3601 (class 2606 OID 34368)
-- Name: tipo_documento_FK; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY personas_documentos_identificacion
    ADD CONSTRAINT "tipo_documento_FK" FOREIGN KEY (id_tipo_documento) REFERENCES tipo_documento_identificacion(id);


SET search_path = talento_humano, pg_catalog;

--
-- TOC entry 3610 (class 2606 OID 34373)
-- Name: estado; Type: FK CONSTRAINT; Schema: talento_humano; Owner: postgres
--

ALTER TABLE ONLY tipos_contratos
    ADD CONSTRAINT estado FOREIGN KEY (estado) REFERENCES public.estados(id);


--
-- TOC entry 3606 (class 2606 OID 34378)
-- Name: estado_empleado_FK; Type: FK CONSTRAINT; Schema: talento_humano; Owner: postgres
--

ALTER TABLE ONLY empleados
    ADD CONSTRAINT "estado_empleado_FK" FOREIGN KEY (estado) REFERENCES public.estados(id);


--
-- TOC entry 3607 (class 2606 OID 34383)
-- Name: id_cargo_FK; Type: FK CONSTRAINT; Schema: talento_humano; Owner: postgres
--

ALTER TABLE ONLY empleados
    ADD CONSTRAINT "id_cargo_FK" FOREIGN KEY (id_cargo) REFERENCES administracion.empresas(id);


--
-- TOC entry 3608 (class 2606 OID 34388)
-- Name: id_persona_empleado_FK; Type: FK CONSTRAINT; Schema: talento_humano; Owner: postgres
--

ALTER TABLE ONLY empleados
    ADD CONSTRAINT "id_persona_empleado_FK" FOREIGN KEY (id_persona) REFERENCES public.personas(id);


--
-- TOC entry 3609 (class 2606 OID 34393)
-- Name: id_usuario_empleado_FK; Type: FK CONSTRAINT; Schema: talento_humano; Owner: postgres
--

ALTER TABLE ONLY empleados
    ADD CONSTRAINT "id_usuario_empleado_FK" FOREIGN KEY (id_usuario) REFERENCES usuarios.usuarios(id);


SET search_path = usuarios, pg_catalog;

--
-- TOC entry 3611 (class 2606 OID 34398)
-- Name: estado_FK; Type: FK CONSTRAINT; Schema: usuarios; Owner: postgres
--

ALTER TABLE ONLY tipo_usuario
    ADD CONSTRAINT "estado_FK" FOREIGN KEY (estado) REFERENCES public.estados(id);


SET search_path = ventas, pg_catalog;

--
-- TOC entry 3617 (class 2606 OID 34403)
-- Name: factura_estado_FK; Type: FK CONSTRAINT; Schema: ventas; Owner: postgres
--

ALTER TABLE ONLY facturas
    ADD CONSTRAINT "factura_estado_FK" FOREIGN KEY (estado) REFERENCES public.estados(id);


--
-- TOC entry 3605 (class 2606 OID 34408)
-- Name: forma_pago_estado_FK; Type: FK CONSTRAINT; Schema: ventas; Owner: postgres
--

ALTER TABLE ONLY formas_pago
    ADD CONSTRAINT "forma_pago_estado_FK" FOREIGN KEY (estado) REFERENCES public.estados(id);


--
-- TOC entry 3612 (class 2606 OID 34413)
-- Name: id_caja_FK; Type: FK CONSTRAINT; Schema: ventas; Owner: postgres
--

ALTER TABLE ONLY caja_usuario
    ADD CONSTRAINT "id_caja_FK" FOREIGN KEY (id_caja) REFERENCES caja(id);


--
-- TOC entry 3616 (class 2606 OID 34418)
-- Name: id_empleado; Type: FK CONSTRAINT; Schema: ventas; Owner: postgres
--

ALTER TABLE ONLY empleado_factura
    ADD CONSTRAINT id_empleado FOREIGN KEY (id_empleado) REFERENCES talento_humano.empleados(id);


--
-- TOC entry 3613 (class 2606 OID 34423)
-- Name: id_empleado_FK; Type: FK CONSTRAINT; Schema: ventas; Owner: postgres
--

ALTER TABLE ONLY caja_usuario
    ADD CONSTRAINT "id_empleado_FK" FOREIGN KEY (id_empleado) REFERENCES talento_humano.empleados(id);


--
-- TOC entry 3615 (class 2606 OID 34428)
-- Name: id_factura_FK; Type: FK CONSTRAINT; Schema: ventas; Owner: postgres
--

ALTER TABLE ONLY clave_factura
    ADD CONSTRAINT "id_factura_FK" FOREIGN KEY (id_factura) REFERENCES facturas(id);


--
-- TOC entry 3614 (class 2606 OID 34433)
-- Name: id_usuario_FK; Type: FK CONSTRAINT; Schema: ventas; Owner: postgres
--

ALTER TABLE ONLY caja_usuario
    ADD CONSTRAINT "id_usuario_FK" FOREIGN KEY (id_usuario) REFERENCES usuarios.usuarios(id);


--
-- TOC entry 3618 (class 2606 OID 34438)
-- Name: producto_catalogo_catalogo; Type: FK CONSTRAINT; Schema: ventas; Owner: postgres
--

ALTER TABLE ONLY producto_descuento
    ADD CONSTRAINT producto_catalogo_catalogo FOREIGN KEY (id_catalogo) REFERENCES inventario.catalogos(id);


--
-- TOC entry 3949 (class 0 OID 0)
-- Dependencies: 15
-- Name: public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE ALL ON SCHEMA public FROM PUBLIC;
REVOKE ALL ON SCHEMA public FROM postgres;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO PUBLIC;


-- Completed on 2017-10-31 10:49:15 -05

--
-- PostgreSQL database dump complete
--

