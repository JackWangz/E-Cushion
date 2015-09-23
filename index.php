<?php
    if (!isset($_SESSION)) { session_start(); }
    if (!isset($_SESSION["Member_ID"])) {
        header('Location: ./users/sign_in.php');
        exit();
    }
?>

<html>
    <head>
    <meta charset="utf-8">
    <link rel="stylesheet" href="css/style.css" type="text/css"> 
    <script src="https://code.jquery.com/jquery-2.1.4.min.js"></script>
    <script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js"></script>
    <script type="text/javascript" src="js/base.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/d3/3.5.5/d3.min.js"></script>
    <script src="ajax_showdata.js"></script>
    <!--Drag & Drop Referrences-->
    <script src="js/jquery.event.drag-2.2.js"></script>
    <script src="js/jquery.event.drag.live-2.2.js"></script>
    <script src="js/jquery.event.drop-2.2.js"></script>
    <script src="js/jquery.event.drop.live-2.2.js"></script>
    </head>
    <body onload="loadChartPage()">
        <header class="top-header">
            <div class="header-cell-left">
                <div class="viewNav">
                    <img class="svg" src="assets/menu-alt.svg">
                </div>
            </div>
            <div class="header-cell-center">
                <div class="brand-logo">
                    <a>E-Cushion</a>
                </div>
            </div>
            <div class="header-cell-right">
                <span class="accountBar">
                    <a href="#">Sign In</a>
                    <span class="profile-image">
                        <img src="https://fbcdn-profile-a.akamaihd.net/hprofile-ak-xap1/v/t1.0-1/p160x160/10431555_10205826534729405_5977811385716894905_n.jpg?oh=f78cad49ac921adb5d7a0aa02964a04a&oe=560FE31D&__gda__=1448108744_98a264994934511489e61dc343507899">
                    </span>  
                </span>
            </div>
        </header>

        <div class="left-container" style="transform: translateX(-220px);">
            <div class="section-function">
                <ul class="u-textCenter">
                    <li id="link-table">
                        <a>Seat Table</a>
                    </li>   
                    <li id="link-chart">
                         <a>Chart</a>
                     </li>
                    <li id="link-settings">
                        <a>Settings</a>
                    </li>
                </ul>
            </div>
        </div>
        <div class="right-container">
            <div class="section-header">
            </div>
        </div>
        <!-- <div id="btn-addtable">+</div> -->
        <!-- <div class="popup"></div> -->
        <!-- <div id="btn-add">+</div> -->
    </body>
</html>
