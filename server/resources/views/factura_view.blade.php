<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>FACTURA No. {{$data['cabecera']['nromFactura']}}</title>
    {!! Html::style('css/factura/style.css') !!}
  </head>
  <body>
    <header>
    </header>
    <main>
<div id="container">
        <div class="left">
        <img src="../public/img/logo_fac.png" style="width: 290px;">
        <p>{{$data['cabecera']['razonSocial']}}</p>
        <p>RUC: {{$data['cabecera']['ruc']}}</p>
        <p>Dir Matriz: {{$data['cabecera']['dirMatriz']}}</p>
        <p>Obligado a llevar Contabilidad: {{$data['cabecera']['obligadoContabilidad']}}</p>
        <p>Fecha de Emisión: {{$data['cabecera']['fechaEmision']}}</p>
        <p>Guía de Remisión:</p
        </div> 
        <div style="    width: 50%;   float: right;">
        <p>RUC / CI: {{$data['cliente']['cedula']}}</p>
        <p>Razón Social / Nombres y Apellidos: {{$data['cliente']['nombres_apellidos']}}</p>
        <p>FACTURA No. {{$data['cabecera']['nromFactura']}}</p>
        <p>NÚMERO DE AUTORIZACIÓN:</p>
        <p>FECHA Y HORA DE AUTORIZACIÓN:</p>
        <p>AMBIENTE:{{$data['cabecera']['ambiente']}}</p>
        <p>EMISIÓN: {{$data['cabecera']['tipoEmision']}}</p>
        <p>CLAVE DE ACCESO: {{$data['cabecera']['claveAcceso']}}</p>
        <div id="clave_acceso">
        <img src="../public/temp.gif" >
        </div> 
</div> 

  <br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>
<h1>Detalles</h1>
      <table border="0" cellspacing="0" cellpadding="4" id="tabla_detalles">
        <thead>
          <tr>
            <th>Cod. Princial</th>
            <th >Cant.</th>
            <th >Descripción</th>
            <th >Detalle Adicional</th>
            <th >Precio Unitario</th>
            <th >Descuento</th>
            <th >Precio Total</th>
          </tr>
        </thead>
        <tbody>

        @foreach ($data['detalles'] as $item) 
          <tr>
            <td >{{ $item['codigoPrincipal'] }}</td>
            <td >{{ $item['cantidad'] }}</td>
            <td >{{ $item['descripcion'] }}</td>
            <td ></td>
            <td >{{ $item['precioUnitario'] }}</td>
            <td >{{ $item['descuento'] }}</td>
            <td >{{ $item['precioTotalSinImpuesto'] }}</td>
          </tr>
        @endforeach

        </tbody>
        <tfoot>
@foreach ($data['impuestos'] as $impuesto) 
          <tr>
            <td colspan="3"></td>
            <td colspan="3">{{ $impuesto->nombre }}</td>
            <td>{{ $impuesto->valor }}</td>
          </tr>
@endforeach
          <tr>
            <td colspan="3"></td>
            <td colspan="3">DESCUENTO</td>
            <td>{{$data['totales']['descuento']}}</td>
          </tr>
          <tr>
            <td colspan="3"></td>
            <td colspan="3">PROPINA</td>
            <td>{{$data['totales']['propina']}}</td>
          </tr>
          <tr>
            <td colspan="3"></td>
            <td colspan="3">VALOR TOTAL</td>
            <td>{{$data['totales']['valor_total']}}</td>
          </tr>
        </tfoot>
      </table>

  </body>
</html>