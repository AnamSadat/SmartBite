package com.capstone.smartbite.data

import com.google.gson.annotations.SerializedName
import java.io.Serializable

data class FileUploadResponse(

	@field:SerializedName("error")
	val error: Boolean,

	@field:SerializedName("message")
	val message: String,

	@field:SerializedName("food")
	val food: Food
) : Serializable

data class Food(

	@field:SerializedName("food_name")
	val foodName: String,

	@field:SerializedName("nutrition_info")
	val nutritionInfo: NutritionInfo,

	@field:SerializedName("probability")
	val probability: String,

	@field:SerializedName("food_id")
	val foodId: String
) : Serializable

class NutritionInfo(

	@field:SerializedName("protein")
	val protein: Any,

	@field:SerializedName("fat")
	val fat: Any,

	@field:SerializedName("calories")
	val calories: Int,

	@field:SerializedName("carbohydrate")
	val carbohydrate: Any
) : Serializable