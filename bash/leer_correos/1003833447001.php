<?php
            $url = "http://186.4.167.12/special_services/public/index.php/Read_Emails?email=1003833447001@nextbook.ec";
            $ch = curl_init($url);
            curl_setopt($ch, CURLOPT_POST, 1);
            curl_setopt($ch, CURLOPT_POSTFIELDS, "email=1003833447001@nextbook.ec");
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            $response = curl_exec($ch);
            curl_close($ch);
            //$json = json_decode($response, true);
            //print_r($json);
            echo "\nOBTENIENDO CORREOS DE: 1003833447001.......";
              ?>