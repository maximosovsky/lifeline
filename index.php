<?php

	require_once __DIR__ . '/vendor/autoload.php';

	// error_reporting(E_ALL & ~E_NOTICE);
	setlocale (LC_ALL, 'ru_RU', 'ru_RU.UTF-8', 'ru', 'russian');
	ini_set("pcre.backtrack_limit", "1100000");

	$html = <<<EOT
<html>
<head>
<style>
	html, body { font-family: Plex, FreeSans, sans-serif; font-size: 9.8pt; overflow-x: visible; }
	table, tr, td, h1, h2, h3 {
		margin: 0;
		padding: 0;
		border-spacing: 0;
		border-collapse: separate;
	}
	td {
		position: relative;
		overflow: hidden;
		vertical-align: top;
	}
	.bt {
		border-top: solid .25pt black !important;
	}
	.bb {
		border-bottom: solid .25pt black !important;
	}
	.bl {
		width: 26rem;
		border-left: solid .75pt black !important;
	}
	.br {
		border-right: solid .75pt black !important;
	}
	.plr {
		padding-left: 1rem;
	}
	.pln {
		padding-left: .75rem;
	}
	.year {
		padding: 0 0 1.25rem .7rem;
	}
	td.mv {
		padding-top: 0;
		padding-bottom: .3rem;
	}
	td.mv-b {
		padding-top: 0;
		padding-bottom: .8rem;
	}
	td.mb {
		padding: 1.25rem 0 .5rem .9rem !important;
	}
	h1 {
		margin: 0;
		padding: 0;
		font-size: 4.5rem;
		font-weight: lighter;
		letter-spacing: -.03em;
	}
	h2 {
		margin: 0;
		padding: 0;
		font-size: 3.5rem;
		font-weight: lighter;
		letter-spacing: -.025em;
	}
	h3 {
		font-size: 1.75rem;
		font-weight: bold;
		letter-spacing: .015rem;
	}
	td.h { 
		font-size: .45rem;
		text-align: center;
		width: .65rem;
		overflow-x: hidden;
		padding: .2rem .1em .2rem .1em;
		margin: 0;
	}
	td.e-h {
		margin: 0;
		width: .65rem;
		height: 1.5rem;
		border-left: solid .25pt black;
		border-bottom: solid .25pt black;
	}
	td.e-h.h-f { 
		border-left: none;
	}
	.h > div {
		padding-bottom: .05rem;
	}
	td.bwd, td.bd {
		font-size: 1rem;
		vertical-align: bottom;
	}
	td.bwd {
		margin: 0;
		padding: .1rem 0 .3rem 0;
		width: 9%;
		font-size: .65rem;
		font-weight: bold;
	}
	td.bd {
		margin: 0;
		padding: .4rem 0 .1rem 0;
		width: 9%;
	}
	td.bwn  { 
		width: 25%;
		vertical-align: bottom;
		padding-left: .3rem !important;
		padding-bottom: .17rem !important;
		font-size: .65rem;
	}
	td.vl {
		margin: 0;
		padding-top: .35rem;
		padding-bottom: .15rem;
	}
	.vd {
		font-size: 1.5rem;
	}
	.vw {
		font-size: .75rem !important;
		letter-spacing: .05em !important;
	}
	td.vl.hd { 
		padding-right: .6rem;
		padding-bottom: .325rem;
		font-size: .65rem;
		letter-spacing: .025em;
		text-align:right;
		vertical-align: bottom
	}
	.red { color: #e10000; }
	.clear { clear: both; }
</style>
</head>
<body>
EOT;

	// Подготовка переменных
	// и справочников
	$helpers = array(
		'months' => [
			0, 
			'Январь',
			'Февраль',
			'Март',
			'Апрель',
			'Май',
			'Июнь',
			'Июль',
			'Август',
			'Сентябрь',
			'Октябрь',
			'Ноябрь',
			'Декабрь',
		],
		'week_days' => [
			'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс',
		],
		'week_days_narrow' => [
			'П', 'В', 'С', 'Ч', 'П', 'С', 'В',
		],
		'holidays' => [
			'0223' => 'День защитника Отечества',
			'0308' => 'Международный женский день',
			'0501' => 'Праздник весны и труда',
			'0509' => 'День Победы',
			'0612' => 'День России',
			'1104' => 'День народного единства',
		],
		'hor'   => array(),
		'ver'   => array(),
		'emp'   => array(),
		'box'   => array(),
		'index' => array(),
		'iname' => array(),
		'iyear' => array(),
	);

	$cal_start_date   = new DateTime('first day of this month'); // start date
	$cal_cur_date     = (clone $cal_start_date); // technical: loop runner
	$cal_length       = (isset($_GET['l']) && $_GET['l'] > 0 && $_GET['l'] < 50) ? $_GET['l'] : 2; // months, if not set then total's default
	$empty_rows       = (isset($_GET['g']) && $_GET['g'] > 4 && $_GET['g'] < 16) ? $_GET['g'] : 10; 

	$cal_total_length = ($cal_length) ? ($cal_length - 1) : 2; // months (default: 24)
	$cal_end_date     = (clone $cal_start_date)->modify("+$cal_total_length month"); // end date
	$cal_end_date->modify('last day of this month');

	

	// Общий цикл по каждому дню диапазона
	// Формирует все типы календарей в заданном диапазоне дат
	$cal_end_date->modify('+1 day');
	while ($cal_cur_date != $cal_end_date) {

		$holliday = $helpers['holidays'][$cal_cur_date->format('md')] ?? '';
		// $isWeekend = function ($date) { return (date('N', strtotime($date)) >= 6); };
		$weekend  = (date('N', strtotime($cal_cur_date->format('Y-m-d'))) >= 6) ? ' red' : '';
		$index    = $cal_cur_date->format('ym');
		$day      = $cal_cur_date->format('j');
		$last_day = date('t', strtotime($cal_cur_date->format('Y-m-d')));

		if ( array_key_exists($index, $helpers['emp']) == false )
			$helpers['emp'][$index] = $helpers['hor'][$index] = $helpers['ver'][$index] = $helpers['box'][$index] = '';

		$helpers['emp'][$index] .= cal_hor_cel($day);
		$helpers['hor'][$index] .= cal_hor_cel(
											$day, 
											$helpers['week_days_narrow'][$cal_cur_date->format('N')-1], 
											$weekend);
		$helpers['ver'][$index] .= cal_ver_row(
											$day, 
											$helpers['week_days'][$cal_cur_date->format('N')-1], 
											$weekend, 
											$holliday);
		$helpers['box'][$index] .= cal_box_cel(
											$day, 
											$cal_cur_date->format('N'), 
											$last_day,
											$cal_cur_date->format('W'), 
											$weekend, 
											$helpers['week_days']);
		if ($day == $last_day) {
			$n = 0;
			while ($n < 31 - $day) {
				$helpers['ver'][$index] .= cal_ver_row();
				$n++;
			}
			array_push($helpers['index'], $index);
			array_push($helpers['iname'], $helpers['months'][(int)$cal_cur_date->format('m')]);
			array_push($helpers['iyear'], $cal_cur_date->format('Y'));
		}
		$cal_cur_date->modify('+1 day');
	}
	$cal_end_date->modify('-1 day');
	// Окончание цикла фиормирования типов календарей

	// Вывод календарей
	// в заданном диапазоне дат
	$arr        = array('r1'=>'<td></td>','r2'=>'<td></td>','r3'=>'<td></td>','r4'=>'<td></td>','r5'=>'<td></td>','r6'=>'<td></td>');
	$html      .= '<table autosize="1" class="br"><tbody>'."\n";
	for ($i = 0; $i <= $cal_total_length; $i++) {
		if ($i == 0) {
			$arr['r4']  = '<td><table width="100%" class="m-hor">';
			$arr['r4'] .= '<tr><td class="h" style="width: 26rem"><div>&nbsp;</div>&nbsp;</td></tr>';
			$arr['r4'] .= str_repeat('<tr>'.cal_hor_cel(1).'</tr>', $empty_rows);
			$arr['r4'] .= '</table></td>';
		}
		if (!isset($helpers['iyear'][$i-1]) or $helpers['iyear'][$i-1] != $helpers['iyear'][$i] ) {
			$arr['r1'] .= '<td class="year bl"><h1>'.$helpers['iyear'][$i].'</h1></td>';
		} else {
			$arr['r1'] .= '<td></td>';
		}
// 		$arr['r2'] .= <<<EOT
// <td class="bl"><table width="100%" class="m-hor"><tr>{$helpers['hor'][$helpers['index'][$i]]}</tr></table></td>
// EOT;
		$arr['r2'] .= <<<EOT
<td class="bl pln mv"><h2>{$helpers['iname'][$i]}</h2></td>
EOT;
		$arr['r3'] .= <<<EOT
<td class="bl plr mv-b"><table width="100%">{$helpers['ver'][$helpers['index'][$i]]}</table></td>
EOT;
		$arr['r4'] .= '<td class="bl"><table width="100%" class="m-hor">';
		$arr['r4'] .= '<tr>'.$helpers['hor'][$helpers['index'][$i]].'</tr>';
		$arr['r4'] .= str_repeat('<tr>'.$helpers['emp'][$helpers['index'][$i]].'</tr>', $empty_rows);
		$arr['r4'] .= '</table></td>';

		$arr['r5'] .= <<<EOT
<td class="bl mb"><h3>{$helpers['iname'][$i]}</h3></td>
EOT;
		$arr['r6'] .= <<<EOT
<td class="bl plr"><table width="100%">{$helpers['box'][$helpers['index'][$i]]}</table></td>
EOT;

	}
	$html .= '<tr>'.implode("</tr>\n<tr>", $arr).'</tr>'."\n";
	$html .= '</tbody></table>';
	$html .= '</body></html>';

	if (isset($_GET['o']) && $_GET['o'] == 'pdf') {
		$defaultConfig      = (new Mpdf\Config\ConfigVariables())->getDefaults();
		$fontDirs           = $defaultConfig['fontDir'];
		$defaultFontConfig  = (new Mpdf\Config\FontVariables())->getDefaults();
		$fontData           = $defaultFontConfig['fontdata'];
		$mpdf = new \Mpdf\Mpdf([
			'tempDir'       => __DIR__ . '/temp',
			'mode'          => 'utf-8',
			'format'        => 'A3'.(($cal_length > 5) ? '-L' : ''),
			'margin_left'   => 10, 'margin_right' => 10, 'margin_top' => 10, 'margin_bottom' => 5,
			'fontDir'       => array_merge($fontDirs, [__DIR__ . '/fonts']),
			'fontdata'      => $fontData + [
				'plex'      => [
					'R'     => 'IBMPlexSans-Regular.ttf',
					'B'     => 'IBMPlexSans-Medium.ttf',
				]
			],
			'default_font'  => 'plex'
			]);
		$mpdf->useSubstitutions = false;
		$mpdf->shrink_tables_to_fit = 1;
		$mpdf->SetDisplayMode('fullpage');
		$mpdf->WriteHTML($html);
		$mpdf->Output();
	} elseif (!isset($_GET['o']) or $_GET['o'] == 'html') {
		echo $html;
	} else {
		echo 'Неверный код параметра /?o=...';
		die;
	}


	//
	// Вспомогательные функции
	//
	function cal_box_cel($day = 0, $day_week = 0, $day_last = 0, $week_num = 0, $add_classes = '', $day_names = []) {
		$html      = '';
		$is_sunday = ($day_week == 7) ? true : false;
		$classes   = 'bd'.($is_sunday ? ' b-sun' : '').$add_classes;

		if ($day_week == 1 or $day == 1) {
			$html .= '<tr>';
			if ($day == 1) {
				foreach ($day_names as $key => $val)
					$html .= '<td class="bwd bb'.(($key > 4) ? ' red' : '').(($key == 6) ? ' b-sun' : '').'">'.$val.'</td>';
				$html .= '<td></td></tr><tr>';
				for ($n = 1; $n < $day_week; $n++)
					$html .= '<td class="bd"> </td>';
			}
		}
		$html .= <<<EOT
<td class="$classes">$day</td>
EOT;
		if ($day == $day_last) {
			$rest = 7 - $day_week;
			for ($n = 0; $n < $rest; $n++) {
				$day_week++;
				$html .= '<td class="'.$classes.'"> </td>';
			}
		}
		if ($day_week == 7) $html .= '<td class="bwn">'.$week_num.'</td></tr>';
		return $html;
	}

	function cal_hor_cel($day = 0, $day_name = ' ', $add_classes = '') {
		$classes = (($day_name == ' ') ? 'e-' : '').'h'.(($day == 1) ? ' h-f' : '').$add_classes;
		$day     =  ($day_name == ' ') ? '' : $day;
		$html    = <<<EOT
<td class="$classes"><div>$day_name</div>$day</td>
EOT;
		return $html;
	}

	function cal_ver_row($day = '&nbsp;', $day_name = ' ', $add_classes = '', $holliday_name = '') {
		$classes = 'vl bb'.(($day == 1) ? ' bt' : '').$add_classes;
		$html    = <<<EOT
<tr><td class="$classes"><span class="vd">$day</span> <span class="vw">$day_name</span></td><td class="$classes hd"> $holliday_name</td></tr>
EOT;
		return $html;
	}
?>