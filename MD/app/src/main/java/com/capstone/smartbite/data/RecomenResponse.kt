package com.capstone.smartbite.data

import com.google.gson.annotations.SerializedName

  data class RecomenResponse(

	@field:SerializedName("listFood")
	val listFood: List<ListFoodItem>,

	@field:SerializedName("error")
	val error: Boolean,

	@field:SerializedName("message")
	val message: String
)

 class ListFoodItem(

	@field:SerializedName("image")
	val image: String,

	@field:SerializedName("foodname")
	val foodname: String,

	@field:SerializedName("id")
	val id: Int,

	@field:SerializedName("calories")
	val calories: Int
)
