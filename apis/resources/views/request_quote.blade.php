<h3>Quote request details as follows:</h3>

<p>
	<strong>Product Name: </strong>{{ $product_name }}
</p>
<p>
	<strong>Quantity: </strong>{{ $quantity }}
</p>
<p>
	<strong>Unit: </strong>{{ $unit }}
</p>
<p>
	<strong>Price: </strong>{{ $rate }}
</p>
<!-- <p>
	<strong>Do you need Credit Payment Facility?</strong> {{ $is_credit == 1 ? 'Yes' : 'No' }}
</p>
 -->
 <!-- <p>
	<strong>Pincode: </strong>{{ $pincode }}
</p> -->
<?php if (!empty($requirements)) { ?>
<p>
	<strong>Requirements: </strong>{{ $requirements }}
</p>
<?php
} ?>
<p>
	<strong>Submitted By: </strong>{{ $submitted_by }}
</p>