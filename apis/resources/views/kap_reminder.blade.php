<h2 style="font-family: 'Trebuchet MS';">Today Followup's</h4>

@foreach($kaps as $kkey => $kvalue)

	<h3 style="margin: 0px; margin-bottom: 5px;font-family: 'Trebuchet MS';">{{ $kkey }}</h3>

	<table border="1" style="border-collapse: collapse; margin-bottom: 40px;">
		<tr>
			<th style="border: 1px solid #000000; padding: 5px;font-family: 'Trebuchet MS';">#</th>
			<th style="border: 1px solid #000000; padding: 5px;font-family: 'Trebuchet MS';">Company</th>
			<th style="border: 1px solid #000000; padding: 5px;font-family: 'Trebuchet MS';">Activity Planned</th>
		</tr>
			<?php $i=1; ?>
			@foreach($kvalue as $akey => $avalue)
			<tr>
				<td style="border: 1px solid #000000; padding: 5px; font-weight: normal;font-family: 'Trebuchet MS';"><?php echo $i++; ?></td>
				<td style="border: 1px solid #000000; padding: 5px; font-weight: normal;font-family: 'Trebuchet MS';">{{ $avalue->lead_name }}</td>
				<td style="border: 1px solid #000000; padding: 5px; font-weight: normal;font-family: 'Trebuchet MS';">{{ $avalue->activity }}</td>
			</tr>
			@endforeach		
	</table>

@endforeach
